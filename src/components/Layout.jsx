import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useSite } from "../context/SiteContext.jsx";

// قالب مشترک همه‌ی صفحه‌ها: منو بالا، محتوای صفحه (Outlet)، فوتر پایین
function Layout() {
  const { error } = useSite();
  const { pathname } = useLocation();

  // با عوض شدن صفحه، به بالای صفحه برگرد
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />
      {error && (
        <p role="alert" className="bg-red-100 p-3 text-center text-red-800">
          {error}
        </p>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
