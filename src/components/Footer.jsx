import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";
import { STATIC_MODE } from "../api.js";

// لینک‌های سریع فوتر
const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Skills", to: "/skills" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Footer() {
  const { profile } = useSite();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* ستون ۱: اسم و معرفی کوتاه */}
        <div>
          <p className="text-xl font-extrabold text-white">{profile.name}</p>
          <p className="mt-1 font-medium text-cyan-300">{profile.role}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
            {profile.intro}
          </p>
        </div>

        {/* ستون ۲: لینک‌های سریع */}
        <nav aria-label="Footer navigation">
          <h2 className="font-bold text-white">Quick links</h2>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ستون ۳: راه‌های ارتباطی (فقط مواردی که در CMS پر شده‌اند) */}
        <div>
          <h2 className="font-bold text-white">Get in touch</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {profile.email && (
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-slate-400 transition hover:text-white"
                >
                  {profile.email}
                </a>
              </li>
            )}
            {profile.github && (
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition hover:text-white"
                >
                  GitHub
                </a>
              </li>
            )}
            {profile.linkedin && (
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* نوار پایین: کپی‌رایت، بازگشت به بالا، ادمین */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with React and
            Tailwind CSS.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="underline hover:text-white"
            >
              Back to top
            </button>
            {!STATIC_MODE && (
              <Link to="/admin" className="underline hover:text-white">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
