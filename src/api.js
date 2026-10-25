// آدرس سرور. در حالت توسعه خالی است چون Vite درخواست‌ها را پروکسی می‌کند
export const API_URL = import.meta.env.VITE_API_URL || "";

// عکس‌های آپلود شده روی سرور هستند، پس آدرس سرور را جلویشان می‌گذاریم
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

// تابع کمکی برای صدا زدن سرور. body می‌تواند object یا FormData باشد
export async function api(path, options = {}) {
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
    // مثلاً اینترنت قطع است یا سرور خاموش است
    throw new Error(
      "Cannot reach the server. Please check your connection and try again."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // پاسخ JSON نبود
  }

  // توکن ادمین منقضی شده: برگرد به صفحه‌ی ورود
  if (response.status === 401 && token) {
    removeToken();
    window.location.href = "/admin/login";
  }

  if (!response.ok) {
    throw new Error((data && data.error) || "Something went wrong. Please try again.");
  }
  return data;
}
