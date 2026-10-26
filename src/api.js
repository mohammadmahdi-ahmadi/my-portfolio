import { FORM_URL } from "./config.js";

export const API_URL = import.meta.env.VITE_API_URL || "";

// حالت استاتیک: نسخه‌ی آنلاین بدون سرور (روی Vercel)
// در حالت توسعه (npm run dev) یا اگر VITE_API_URL بگذاری، از سرور استفاده می‌شود
export const STATIC_MODE = !import.meta.env.DEV && !import.meta.env.VITE_API_URL;

const NETWORK_ERROR =
  "Cannot reach the server. Please check your connection and try again.";

export function imageUrl(path) {
  return path.startsWith("/uploads") ? API_URL + path : path;
}

export function getToken() {
  return localStorage.getItem("adminToken");
}
export function setToken(token) {
  localStorage.setItem("adminToken", token);
}
export function removeToken() {
  localStorage.removeItem("adminToken");
}

// در حالت استاتیک: محتوا از content.json و فرم تماس از Formspree
async function staticApi(path, options) {
  const method = options.method || "GET";

  if (method === "GET" && ["/profile", "/projects", "/skills"].includes(path)) {
    let response;
    try {
      response = await fetch("/content.json");
    } catch (error) {
      throw new Error(NETWORK_ERROR);
    }
    if (!response.ok) throw new Error("Could not load the site content.");
    const content = await response.json();
    return content[path.slice(1)];
  }

  if (method === "POST" && path === "/messages") {
    let response;
    try {
      response = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(options.body),
      });
    } catch (error) {
      throw new Error(NETWORK_ERROR);
    }
    if (!response.ok) {
      throw new Error("The message could not be delivered. Please try again later.");
    }
    return { ok: true };
  }

  throw new Error("The CMS only works when you run the project on your own computer.");
}

export async function api(path, options = {}) {
  if (STATIC_MODE) return staticApi(path, options);

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(API_URL + "/api" + path, {
      method: options.method || "GET",
      headers,
      body,
    });
  } catch (error) {
    throw new Error(NETWORK_ERROR);
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // پاسخ JSON نبود
  }

  if (response.status === 401 && token) {
    removeToken();
    window.location.href = "/admin/login";
  }

  if (!response.ok) {
    throw new Error((data && data.error) || "Something went wrong. Please try again.");
  }
  return data;
}