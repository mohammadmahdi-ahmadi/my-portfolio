import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import LoginPage from "./admin/LoginPage.jsx";
import DashboardPage from "./admin/DashboardPage.jsx";
import { STATIC_MODE } from "./api.js";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* در نسخه‌ی آنلاین بدون سرور، صفحه‌های ادمین وجود ندارند */}
      <Route
        path="/admin/login"
        element={STATIC_MODE ? <NotFoundPage /> : <LoginPage />}
      />
      <Route
        path="/admin"
        element={STATIC_MODE ? <NotFoundPage /> : <DashboardPage />}
      />
    </Routes>
  );
}

export default App;