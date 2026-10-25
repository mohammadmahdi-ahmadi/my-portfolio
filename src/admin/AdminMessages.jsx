import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../api.js";
import { Loading, ErrorBox } from "../components/Status.jsx";
import { dangerButton } from "./styles.js";

function AdminMessages() {
  const { data: messages, loading, error, reload } = useFetch("/messages");
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api(`/messages/${id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setDeleteError(err.message);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Messages from the contact form</h2>
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {deleteError && <p role="alert" className="mt-2 text-red-700">{deleteError}</p>}
      {messages && messages.length === 0 && <p className="mt-3 text-slate-600">No messages yet.</p>}

      <ul className="mt-3 space-y-3">
        {(messages || []).map((m) => (
          <li key={m.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {m.name} · <a className="text-indigo-600 underline" href={`mailto:${m.email}`}>{m.email}</a>
              </p>
              <p className="text-sm text-slate-500">{new Date(m.date).toLocaleString()}</p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{m.message}</p>
            <button type="button" onClick={() => handleDelete(m.id)} className={`${dangerButton} mt-3`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminMessages;
