import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Skills", to: "/skills" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const { profile } = useSite();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <Link to="/" className="text-xl font-extrabold text-slate-900">
          {profile.name}
        </Link>

        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>

        <ul
          id="menu"
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute left-0 top-full w-full flex-col gap-1 border-b border-slate-200 bg-white p-4 shadow-lg md:static md:flex md:w-auto md:flex-row md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map((link) => (
            <li key={link.to}>
              {/* NavLink صفحه‌ی فعال را خودش تشخیص می‌دهد (isActive) */}
              <NavLink
                to={link.to}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 font-medium transition hover:bg-indigo-50 hover:text-indigo-700 ${
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
