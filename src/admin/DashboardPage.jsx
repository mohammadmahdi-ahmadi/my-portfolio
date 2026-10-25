import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../api.js";
import AdminProjects from "./AdminProjects.jsx";
import AdminSkills from "./AdminSkills.jsx";
import AdminProfile from "./AdminProfile.jsx";
import AdminMessages from "./AdminMessages.jsx";
import { smallButton } from "./styles.js";

const tabs = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "profile", label: "Profile & texts" },
  { id: "messages", label: "Messages" },
];

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();

  // اگر وارد نشده، به صفحه‌ی ورود برو
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />;
  }

  function logout() {
    removeToken();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-extrabold text-slate-900">Portfolio CMS</h1>
          <div className="flex gap-2">
            <Link to="/" className={smallButton}>View website</Link>
            <button type="button" onClick={logout} className={smallButton}>Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "projects" && <AdminProjects />}
          {activeTab === "skills" && <AdminSkills />}
          {activeTab === "profile" && <AdminProfile />}
          {activeTab === "messages" && <AdminMessages />}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
