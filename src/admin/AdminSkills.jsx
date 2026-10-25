import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../api.js";
import { Loading, ErrorBox } from "../components/Status.jsx";
import { inputClass, labelClass, primaryButton, secondaryButton, smallButton, dangerButton } from "./styles.js";

const emptyForm = { name: "", detail: "" };

function AdminSkills() {
  const { data: skills, loading, error, reload } = useFetch("/skills");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        await api(`/skills/${editingId}`, { method: "PUT", body: form });
      } else {
        await api("/skills", { method: "POST", body: form });
      }
      setForm(emptyForm);
      setEditingId(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill) {
    if (!window.confirm(`Delete "${skill.name}"?`)) return;
    try {
      await api(`/skills/${skill.id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">{editingId ? "Edit skill" : "Add a skill"}</h2>
        <div>
          <label htmlFor="skill-name" className={labelClass}>Name</label>
          <input id="skill-name" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="skill-detail" className={labelClass}>What I can do with it</label>
          <input id="skill-detail" name="detail" value={form.detail} onChange={handleChange} className={inputClass} />
        </div>
        {formError && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-800">{formError}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add skill"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className={secondaryButton}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-bold">All skills</h2>
        {loading && <Loading />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        <ul className="mt-3 space-y-3">
          {(skills || []).map((skill) => (
            <li key={skill.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div>
                <p className="font-semibold">{skill.name}</p>
                <p className="text-sm text-slate-600">{skill.detail}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingId(skill.id); setForm({ name: skill.name, detail: skill.detail }); }}
                  className={smallButton}
                >
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(skill)} className={dangerButton}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSkills;
