import useFetch from "../hooks/useFetch.js";
import { Loading, ErrorBox } from "./Status.jsx";

function Skills() {
  const { data: skills, loading, error, reload } = useFetch("/skills");

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Skills</h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
      <p className="mt-4 text-slate-600">Technologies I learned and used in my projects.</p>

      <div className="mt-10">
        {loading && <Loading text="Loading skills..." />}
        {error && <ErrorBox message={error} onRetry={reload} />}

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(skills || []).map((skill) => (
            <li
              key={skill.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-extrabold text-white"
                aria-hidden="true"
              >
                {skill.name[0]}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{skill.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{skill.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
