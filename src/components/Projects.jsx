import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import ProjectCard from "./ProjectCard.jsx";
import { Loading, ErrorBox } from "./Status.jsx";

// limit: اگر عدد بدهیم فقط همان تعداد پروژه نشان داده می‌شود (برای صفحه‌ی اصلی)
function Projects({ limit }) {
  const { data, loading, error, reload } = useFetch("/projects");
  const projects = data ? (limit ? data.slice(0, limit) : data) : [];

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
        {limit ? "Featured projects" : "Projects"}
      </h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
      <p className="mt-4 text-slate-600">Projects I built during the React course.</p>

      <div className="mt-10">
        {loading && <Loading text="Loading projects..." />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {!loading && !error && projects.length === 0 && (
          <p className="text-slate-600">No projects yet.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {limit && (
        <div className="mt-10 text-center">
          <Link
            to="/projects"
            className="inline-block rounded-lg border border-indigo-600 px-5 py-2 font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            See all projects
          </Link>
        </div>
      )}
    </section>
  );
}

export default Projects;
