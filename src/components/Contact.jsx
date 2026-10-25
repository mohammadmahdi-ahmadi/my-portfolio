import { useState } from "react";
import { api } from "../api.js";
import { useSite } from "../context/SiteContext.jsx";

function Contact() {
  const { profile } = useSite();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  // وضعیت ارسال: "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function validate() {
    const newErrors = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters).";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }
    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("loading");
    setServerError("");
    try {
      // پیام به سرور خودمان فرستاده می‌شود و در دیتابیس ذخیره می‌شود
      await api("/messages", { method: "POST", body: formData });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // اگر ارسال نشد، پیام موفقیت نشان نمی‌دهیم
      setServerError(error.message);
      setStatus("error");
    }
  }

  const inputStyle =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";

  return (
    <section id="contact" className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Contact</h2>
        <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
        <p className="mt-4 text-slate-600">
          Have a question or a job opportunity? Send me a message.
        </p>
        <ul className="mt-6 space-y-2">
          {profile.email && (
            <li>
              Email:{" "}
              <a className="font-medium text-indigo-600 underline hover:text-indigo-800" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
          )}
          {profile.github && (
            <li>
              GitHub:{" "}
              <a className="font-medium text-indigo-600 underline hover:text-indigo-800" href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.github.replace("https://", "")}
              </a>
            </li>
          )}
          {profile.linkedin && (
            <li>
              LinkedIn:{" "}
              <a className="font-medium text-indigo-600 underline hover:text-indigo-800" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedin.replace("https://", "")}
              </a>
            </li>
          )}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <div>
          <label htmlFor="name" className="font-semibold text-slate-800">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={inputStyle}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-sm text-red-700">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="font-semibold text-slate-800">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="mt-1 text-sm text-red-700">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="font-semibold text-slate-800">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className={inputStyle}
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && <p id="message-error" className="mt-1 text-sm text-red-700">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </button>

        {status === "success" && (
          <p role="status" className="rounded-lg bg-green-100 p-3 text-green-800">
            Thank you! Your message was sent.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-800">
            Your message was not sent. {serverError}
          </p>
        )}
      </form>
    </section>
  );
}

export default Contact;
