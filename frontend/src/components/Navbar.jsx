import { Link, useLocation } from "react-router-dom";
import { FaCity } from "react-icons/fa";
import { useLanguage } from "../LanguageProvider";
import { translate, LOCALES } from "../i18n";

function Navbar() {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  const navLink = (path) =>
    `transition hover:text-cyan-400 ${
      location.pathname === path
        ? "text-cyan-400 font-semibold"
        : "text-white"
    }`;

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white">
          <FaCity className="text-cyan-400 text-3xl" />
          <span>Civic<span className="text-cyan-400">Lens AI</span></span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6 text-base">
          <Link to="/"          className={navLink("/")}>{translate(language, "nav.home")}</Link>
          <Link to="/about"     className={navLink("/about")}>{translate(language, "nav.about")}</Link>
          <Link to="/dashboard" className={navLink("/dashboard")}>{translate(language, "nav.dashboard")}</Link>
          <Link to="/track"     className={navLink("/track")}>{translate(language, "nav.trackStatus")}</Link>
          <Link
            to="/report"
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            {translate(language, "nav.reportIssue")}
          </Link>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 text-white rounded-xl border border-cyan-500/20 px-3 py-2"
          >
            <option value={LOCALES.EN}>{translate(language, "nav.english")}</option>
            <option value={LOCALES.HI}>{translate(language, "nav.hindi")}</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;