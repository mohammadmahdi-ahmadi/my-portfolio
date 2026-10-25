import { createContext, useContext } from "react";
import useFetch from "../hooks/useFetch.js";

// اگر سرور خاموش بود، سایت با این متن‌های پیش‌فرض نمایش داده می‌شود
const defaultProfile = {
  name: "Your Name",
  role: "React Front-End Developer",
  intro: "",
  bio: "",
  journey: "",
  goals: "",
  email: "",
  github: "",
  linkedin: "",
};

// Context: اطلاعات پروفایل را بدون props به همه‌ی کامپوننت‌ها می‌دهد
const SiteContext = createContext({ profile: defaultProfile, error: "" });

export function SiteProvider({ children }) {
  const { data, loading, error } = useFetch("/profile");

  if (loading) {
    return (
      <p className="p-10 text-center text-slate-600" role="status">
        Loading...
      </p>
    );
  }

  const value = {
    profile: data || defaultProfile,
    error: error ? "Could not load the site content from the server." : "",
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
