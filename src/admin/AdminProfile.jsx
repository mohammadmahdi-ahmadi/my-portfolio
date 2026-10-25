import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../api.js";
import { Loading, ErrorBox } from "../components/Status.jsx";
import { inputClass, labelClass, primaryButton } from "./styles.js";

// [اسم فیلد، برچسب، آیا چند خطی است؟]
const fields = [
  ["name", "Your name", false],
  ["role", "Developer role", false],
  ["intro", "Short introduction (Home page)", true],
  ["bio", "Who I am (About page)", true],
  ["journey", "My learning journey (About page)", true],
  ["goals", "My goals (About page)", true],
  ["email", "Email", false],
  ["github", "GitHub link (https://...)", false],
  ["linkedin", "LinkedIn link (https://...)", false],
];

function AdminProfile() {
  const { data, loading, error, reload } = useFetch("/profile");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  // وقتی اطلاعات از سرور رسید، فرم را با آن پر کن
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setMessage("");
    try {
      await api("/profile", { method: "PUT", body: form });
      setMessage("Saved. Refresh the website to see the changes.");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Profile & texts</h2>
      {fields.map(([name, label, multiline]) => (
        <div key={name}>
          <label htmlFor={`profile-${name}`} className={labelClass}>{label}</label>
          {multiline ? (
            <textarea
              id={`profile-${name}`}
              rows="3"
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className={inputClass}
            />
          ) : (
            <input
              id={`profile-${name}`}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
      ))}
      {formError && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-800">{formError}</p>}
      {message && <p role="status" className="rounded-lg bg-green-100 p-3 text-green-800">{message}</p>}
      <button type="submit" disabled={saving} className={primaryButton}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export default AdminProfile;
