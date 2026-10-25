import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";

function Hero() {
  const { profile } = useSite();

  // حروف اول اسم برای دایره: "Ali Rezaei" -> "AR"
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="home" className="relative overflow-hidden bg-slate-900 text-white">
      <div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/40 blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 py-20 md:flex-row md:py-32">
        <div className="text-center md:flex-1 md:text-left">
          <p className="font-medium text-cyan-300">Hi, I'm</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">{profile.name}</h1>
          <h2 className="mt-3 bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
            {profile.role}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-slate-300 md:mx-0">{profile.intro}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              to="/projects"
              className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              View my projects
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-slate-500 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Contact me
            </Link>
          </div>
        </div>

        <div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-5xl font-extrabold shadow-2xl ring-4 ring-white/20 md:h-56 md:w-56 md:text-7xl"
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>
    </section>
  );
}

export default Hero;
