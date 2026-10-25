import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold text-slate-900">404</h1>
      <p className="mt-3 text-slate-600">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFoundPage;
