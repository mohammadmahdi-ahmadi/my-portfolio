import { useState } from "react";
import { imageUrl } from "../api.js";

function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="overflow-hidden">
        {imageFailed ? (
          <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-500">
            Screenshot could not be loaded
          </div>
        ) : (
          <img
            src={imageUrl(project.image)}
            alt={project.alt}
            width="640"
            height="360"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-slate-600">{project.description}</p>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block self-start rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
        >
          View live project
        </a>
      </div>
    </article>
  );
}

export default ProjectCard;
