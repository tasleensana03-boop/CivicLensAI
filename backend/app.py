import os
import sqlite3
import datetime
import re
import smtplib
import ssl
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from google import genai
from google.genai import types

try:
    from twilio.rest import Client as TwilioClient
except ImportError:
    TwilioClient = None

load_dotenv()

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
EMAIL_FROM = os.getenv("EMAIL_FROM") or SMTP_USER
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_PHONE = os.getenv("TWILIO_FROM_PHONE")

twilio_client = None
if TwilioClient and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception as err:
        print(f"[notification] Twilio init failed: {err}")
# ── Database setup ─────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "reports.db")


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT    NOT NULL,
            location    TEXT,
            analysis    TEXT,
            category    TEXT,
            severity    TEXT,
            department  TEXT,
            status      TEXT    DEFAULT 'Pending',
            email       TEXT,
            phone       TEXT,
            created_at  TEXT    DEFAULT (datetime('now'))
        )
    """)
    db.commit()

    columns = [row[1] for row in db.execute("PRAGMA table_info(reports)").fetchall()]
    if "email" not in columns:
        db.execute("ALTER TABLE reports ADD COLUMN email TEXT")
    if "phone" not in columns:
        db.execute("ALTER TABLE reports ADD COLUMN phone TEXT")
    db.commit()
    db.close()


init_db()

def send_email_notification(to_email, subject, body):
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS and EMAIL_FROM and to_email):
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = EMAIL_FROM
    message["To"] = to_email
    message.set_content(body)

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(message)
        return True
    except Exception as exc:
        print(f"[notification] email send failed: {exc}")
        return False


def send_sms_notification(to_phone, body):
    if not (twilio_client and TWILIO_FROM_PHONE and to_phone):
        return False

    try:
        twilio_client.messages.create(
            body=body,
            from_=TWILIO_FROM_PHONE,
            to=to_phone,
        )
        return True
    except Exception as exc:
        print(f"[notification] sms send failed: {exc}")
        return False


def notify_report_received(report_id, description, location, email, phone):
    if not (email or phone):
        return False

    subject = f"CivicLens AI Report Received #{report_id}"
    body = (
        f"Your civic issue has been received by CivicLens AI.\n\n"
        f"Report ID: #{report_id}\n"
        f"Description: {description[:200]}\n"
        f"Location: {location or 'Not provided'}\n\n"
        "We will notify you when the status changes."
    )
    email_sent = send_email_notification(email, subject, body) if email else False
    sms_sent = send_sms_notification(phone, body) if phone else False
    return email_sent or sms_sent


def notify_status_change(report, old_status):
    if not (report.get("email") or report.get("phone")):
        return False

    subject = f"CivicLens AI Report #{report['id']} Status Updated"
    body = (
        f"Your CivicLens AI report #{report['id']} status has changed from {old_status} to {report['status']}.\n\n"
        f"Location: {report.get('location') or 'Not provided'}\n"
        f"Description: {report.get('description','')[:200]}\n\n"
        "You can check the latest progress on the tracking page."
    )
    email_sent = send_email_notification(report.get("email"), subject, body) if report.get("email") else False
    sms_sent = send_sms_notification(report.get("phone"), body) if report.get("phone") else False
    return email_sent or sms_sent


# ── Helpers ────────────────────────────────────────────────────────────────
def extract_field(text, label):
    """Pull a single-line field value from the structured AI report."""
    pattern = re.compile(rf"{re.escape(label)}[:\s]+([^\n]+)", re.IGNORECASE)
    match = pattern.search(text or "")
    return match.group(1).strip() if match else ""


def normalize(text):
    """Lowercase, strip punctuation for comparison."""
    return re.sub(r"[^a-z0-9\s]", "", (text or "").lower())


def is_duplicate(description, location, hours=24):
    """
    Check if a similar report exists in the last `hours` hours.
    Similarity: location prefix matches AND ≥40% of description words overlap.
    """
    since = (datetime.datetime.utcnow() -
             datetime.timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")

    db = get_db()
    rows = db.execute(
        "SELECT id, description, location, analysis, category, severity, status, created_at "
        "FROM reports WHERE created_at >= ?",
        (since,)
    ).fetchall()
    db.close()

    new_words = set(normalize(description).split())
    if not new_words:
        return None

    # Normalise location to first two comma-separated parts for area matching
    new_loc = ", ".join((location or "").split(",")[:2]).lower().strip()

    for row in rows:
        # Location area check
        existing_loc = ", ".join((row["location"] or "").split(",")[:2]).lower().strip()
        loc_match = new_loc and existing_loc and (
            new_loc in existing_loc or existing_loc in new_loc
        )

        # Description word-overlap check
        existing_words = set(normalize(row["description"]).split())
        if existing_words:
            overlap = len(new_words & existing_words) / len(new_words)
        else:
            overlap = 0

        if loc_match and overlap >= 0.4:
            return dict(row)

    return None


# ── Routes ─────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "CivicLens AI Backend Running 🚀"


@app.route("/analyze", methods=["POST"])
def analyze():
    description = request.form.get("description", "").strip()
    location    = request.form.get("location", "").strip()
    email       = request.form.get("email", "").strip()
    phone       = request.form.get("phone", "").strip()
    image_file  = request.files.get("image")

    if not description:
        return jsonify({"status": "error", "message": "Description is required."}), 400

    # ── Duplicate detection ──────────────────────────────────────────────
    duplicate = is_duplicate(description, location)
    if duplicate:
        return jsonify({
            "status":    "duplicate",
            "message":   "A similar complaint has already been reported in this area recently.",
            "duplicate": {
                "id":          duplicate["id"],
                "description": duplicate["description"],
                "location":    duplicate["location"],
                "category":    duplicate["category"],
                "severity":    duplicate["severity"],
                "status":      duplicate["status"],
                "created_at":  duplicate["created_at"],
                "analysis":    duplicate["analysis"],
            },
        })

    # ── Build Gemini prompt ──────────────────────────────────────────────
    prompt = f"""You are CivicLens AI, an expert civic issue analysis assistant.

Analyze the following civic issue report and provide a detailed structured report.

Description: {description}
Location: {location if location else "Not provided"}

Please provide your analysis in the following structured format:

🔍 ISSUE DETECTED:
[Clearly state the civic issue identified]

🏷️ CATEGORY:
[e.g., Road Infrastructure, Water & Drainage, Electricity, Sanitation, Public Property]

⚠️ SEVERITY LEVEL:
[Critical / High / Medium / Low — with a brief reason]

📋 DETAILED ANALYSIS:
[2-3 sentences about the nature of the problem]

🔧 ROOT CAUSE:
[Most likely cause of this issue]

✅ RECOMMENDED ACTION:
[Specific steps the authorities should take]

🏢 RESPONSIBLE DEPARTMENT:
[Name the specific government department]

⏱️ ESTIMATED RESOLUTION TIME:
[Realistic timeframe for fixing this issue]

🆘 URGENCY NOTE:
[Any immediate safety concern or public impact]
"""

    if image_file:
        image_bytes = image_file.read()
        mime_type   = image_file.content_type or "image/jpeg"
        contents    = [
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            types.Part.from_text(text=prompt),
        ]
    else:
        contents = [types.Part.from_text(text=prompt)]

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
        )
        analysis = response.text
    except Exception as e:
        return jsonify({"status": "error", "message": f"Gemini API error: {str(e)}"}), 500

    # ── Save to database ─────────────────────────────────────────────────
    category   = extract_field(analysis, "CATEGORY")
    severity   = extract_field(analysis, "SEVERITY LEVEL").split("—")[0].strip()
    department = extract_field(analysis, "RESPONSIBLE DEPARTMENT")

    db = get_db()
    cursor = db.execute(
        "INSERT INTO reports (description, location, analysis, category, severity, department, email, phone) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (description, location, analysis, category, severity, department, email, phone)
    )
    report_id = cursor.lastrowid
    db.commit()
    db.close()

    notify_report_received(report_id, description, location, email, phone)

    return jsonify({
        "status":    "success",
        "report_id": report_id,
        "analysis":  analysis,
        "category":  category,
        "severity":  severity,
        "department": department,
    })


@app.route("/reports", methods=["GET"])
def get_reports():
    """Return all reports for the Dashboard."""
    db = get_db()
    rows = db.execute(
        "SELECT id, description, location, category, severity, department, status, created_at "
        "FROM reports ORDER BY created_at DESC"
    ).fetchall()
    db.close()

    reports = [dict(r) for r in rows]

    # Build stats
    total      = len(reports)
    resolved   = sum(1 for r in reports if r["status"] == "Resolved")
    in_progress = sum(1 for r in reports if r["status"] == "In Progress")
    pending    = sum(1 for r in reports if r["status"] == "Pending")

    # Category breakdown
    cat_counts = {}
    for r in reports:
        cat = r["category"] or "Other"
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    return jsonify({
        "status":  "success",
        "stats": {
            "total":       total,
            "resolved":    resolved,
            "in_progress": in_progress,
            "pending":     pending,
        },
        "categories": cat_counts,
        "reports":    reports[:20],   # latest 20 for the table
    })


@app.route("/reports/<int:report_id>", methods=["GET"])
def get_report(report_id):
    """Return a single report by ID for status tracking."""
    db = get_db()
    row = db.execute(
        "SELECT id, description, location, analysis, category, severity, department, status, created_at "
        "FROM reports WHERE id = ?",
        (report_id,)
    ).fetchone()
    db.close()

    if not row:
        return jsonify({"status": "error", "message": f"Report #{report_id} not found."}), 404

    return jsonify({"status": "success", "report": dict(row)})


@app.route("/reports/<int:report_id>/status", methods=["PATCH"])
def update_status(report_id):
    """Update a report's status."""
    new_status = request.json.get("status")
    allowed = {"Pending", "In Progress", "Resolved"}
    if new_status not in allowed:
        return jsonify({"status": "error", "message": "Invalid status."}), 400

    db = get_db()
    existing = db.execute(
        "SELECT status, email, phone, description, location FROM reports WHERE id = ?",
        (report_id,)
    ).fetchone()
    if not existing:
        db.close()
        return jsonify({"status": "error", "message": f"Report #{report_id} not found."}), 404

    old_status = existing["status"]
    db.execute("UPDATE reports SET status = ? WHERE id = ?", (new_status, report_id))
    db.commit()
    db.close()

    if new_status != old_status and (existing["email"] or existing["phone"]):
        notify_status_change({
            "id": report_id,
            "description": existing["description"],
            "location": existing["location"],
            "email": existing["email"],
            "phone": existing["phone"],
            "status": new_status,
        }, old_status)

    return jsonify({"status": "success"})


@app.route("/generate-letter", methods=["POST"])
def generate_letter():
    data        = request.json
    description = data.get("description", "")
    location    = data.get("location", "")
    analysis    = data.get("analysis", "")
    department  = data.get("department", "Municipal Authority")

    if not analysis:
        return jsonify({"status": "error", "message": "Analysis is required."}), 400

    today = datetime.date.today().strftime("%B %d, %Y")

    prompt = f"""You are a professional civic complaint letter writer.

Based on the following civic issue report, write a formal complaint letter from a concerned citizen to the relevant government department.

--- ISSUE DETAILS ---
Description: {description}
Location: {location if location else "Not specified"}
Responsible Department: {department}
AI Analysis Summary:
{analysis}
---------------------

Write a formal, polite, and firm complaint letter. Use the following structure:

Date: {today}

To,
The {department},
[City/Municipal Office]

Subject: Formal Complaint Regarding [issue title] at [location]

Respected Sir/Madam,

[Opening paragraph]
[Body paragraph 1]
[Body paragraph 2]
[Body paragraph 3]
[Closing paragraph]

Yours sincerely,
Concerned Citizen
Date: {today}

Keep it professional, concise (4-5 paragraphs), under 300 words.
Do NOT use placeholder brackets in the final output.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[types.Part.from_text(text=prompt)],
        )
        letter = response.text
    except Exception as e:
        return jsonify({"status": "error", "message": f"Gemini API error: {str(e)}"}), 500

    return jsonify({"status": "success", "letter": letter})


@app.route("/submit-complaint", methods=["POST"])
def submit_complaint():
    """Submit a complaint directly from the app."""
    data        = request.json
    description = data.get("description", "").strip()
    location    = data.get("location", "").strip()
    analysis    = data.get("analysis", "").strip()
    department  = data.get("department", "Municipal Authority").strip()
    email       = data.get("email", "").strip()
    phone       = data.get("phone", "").strip()
    letter      = data.get("letter", "").strip()

    if not (description and (email or phone)):
        return jsonify({"status": "error", "message": "Description and at least one contact method required."}), 400

    # Extract category and severity from analysis
    category = extract_field(analysis, "CATEGORY")
    severity = extract_field(analysis, "SEVERITY LEVEL").split("—")[0].strip()

    # Save to database
    db = get_db()
    cursor = db.execute(
        "INSERT INTO reports (description, location, analysis, category, severity, department, email, phone, status) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (description, location, analysis, category, severity, department, email, phone, "Submitted")
    )
    report_id = cursor.lastrowid
    db.commit()
    db.close()

    # Send notification
    notify_report_received(report_id, description, location, email, phone)

    return jsonify({
        "status": "success",
        "report_id": report_id,
        "message": f"Complaint #{report_id} submitted successfully to {department}!"
    })


if __name__ == "__main__":
    app.run(debug=True)
