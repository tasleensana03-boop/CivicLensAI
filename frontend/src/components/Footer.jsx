import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useLanguage } from "../LanguageProvider";
import { translate } from "../i18n";

const GITHUB_URL = "https://github.com/tasleensana03-boop";
const LINKEDIN_URL = "https://www.linkedin.com/in/tasleen-sana-8ab01a301";
const EMAIL = "tasleensana03@gmail.com";

function Footer() {
  const { language } = useLanguage();

  return (
    <footer style={{
      width: "100%",
      backgroundColor: "#020617",
      borderTop: "1px solid #1e293b",
      padding: "48px 24px",
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "10px",
      }}>

        <h2 style={{ fontSize: "26px", fontWeight: 700, color: "white" }}>
          CivicLens <span style={{ color: "#22d3ee" }}>AI</span>
        </h2>

        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          {translate(language, "footer.description")}
        </p>

        <div style={{ display: "flex", gap: "20px", fontSize: "22px", margin: "6px 0" }}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#94a3b8", textDecoration: "none" }}
          >
            <FaGithub />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#94a3b8", textDecoration: "none" }}
          >
            <FaLinkedin />
          </a>
        </div>

        <a href={`mailto:${EMAIL}`} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>
          {EMAIL}
        </a>

        <p style={{ color: "#475569", fontSize: "13px" }}>
          {translate(language, "footer.rights")}
        </p>

        <p style={{ color: "#22d3ee", fontSize: "13px", fontWeight: 500 }}>
          {translate(language, "footer.builtWith")}
        </p>

        <p style={{ color: "#94a3b8", fontSize: "13px" }}>
          {translate(language, "footer.developedBy", "", { name: "Tasleen Sana" })}
        </p>

      </div>
    </footer>
  );
}

export default Footer;
