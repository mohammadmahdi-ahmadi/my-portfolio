import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { api, imageUrl } from "../api.js";
import { Loading, ErrorBox } from "../components/Status.jsx";
import { inputClass, labelClass, primaryButton, secondaryButton, smallButton, dangerButton } from "./styles.js";

const emptyForm = { title: "", description: "", image: "", alt: "", liveUrl: "" };

function AdminProjects() {
  const { data: projects, loading, error, reload } = useFetch("/projects");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null یعنی پروژه‌ی جدید
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // آپلود عکس به سرور؛ آدرس عکس در فرم ذخیره می‌شود
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setFormError("");
    try {
      const data = await api("/upload", { method: "POST", body: formData });
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setMessage("");
    try {
      if (editingId) {
        await api(`/projects/${editingId}`, { method: "PUT", body: form });
        setMessage("Project updated.");
      } else {
        await api("/projects", { method: "POST", body: form });
        setMessage("Project added.");
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

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image,
      alt: project.alt,
      liveUrl: project.liveUrl,
    });
    setMessage("");
    window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    try {
      await api(`/projects/${project.id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">{editingId ? "Edit project" : "Add a project"}</h2>

        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="liveUrl" className={labelClass}>Live link (https://...)</label>
          <input id="liveUrl" name="liveUrl" type="url" value={form.liveUrl} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="screenshot" className={labelClass}>Screenshot (PNG, JPG or WebP, max 2MB)</label>
          <input id="screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="mt-1 block w-full" />
          {uploading && <p role="status" className="mt-1 text-sm text-slate-600">Uploading...</p>}
          {form.image && (
            <img src={imageUrl(form.image)} alt="Preview of the selected screenshot" className="mt-2 h-28 rounded-lg border border-slate-200 object-cover" />
          )}
        </div>
        <div>
          <label htmlFor="alt" className={labelClass}>Image alt text (describe the screenshot)</label>
          <input id="alt" name="alt" value={form.alt} onChange={handleChange} className={inputClass} required />
        </div>

        {formError && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-800">{formError}</p>}
        {message && <p role="status" className="rounded-lg bg-green-100 p-3 text-green-800">{message}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={saving || uploading} className={primaryButton}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add project"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className={secondaryButton}>Cancel</button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-bold">All projects</h2>
        {loading && <Loading />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        <ul className="mt-3 space-y-3">
          {(projects || []).map((project) => (
            <li key={project.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <img src={imageUrl(project.image)} alt="" className="h-14 w-24 rounded object-cover" />
                <span className="font-semibold">{project.title}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(project)} className={smallButton}>Edit</button>
                <button type="button" onClick={() => handleDelete(project)} className={dangerButton}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminProjects;
