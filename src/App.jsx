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

// هر Route یک صفحه است. صفحه‌های عمومی داخل Layout (منو + فوتر) نمایش داده می‌شوند
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

      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
