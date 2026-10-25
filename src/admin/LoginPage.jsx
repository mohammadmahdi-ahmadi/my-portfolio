import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api.js";
import { inputClass, labelClass, primaryButton } from "./styles.js";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api("/login", { method: "POST", body: { password } });
      setToken(data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <h1 className="text-2xl font-extrabold text-slate-900">Admin login</h1>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
        <button type="submit" disabled={loading} className={`${primaryButton} w-full`}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <Link to="/" className="block text-center text-sm text-indigo-600 underline">
          Back to website
        </Link>
      </form>
    </main>
  );
}

export default LoginPage;
