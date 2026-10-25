import { useState, useEffect } from "react";
import { api } from "../api.js";

// یک hook ساده: داده را از سرور می‌گیرد و وضعیت loading و error را نگه می‌دارد
function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    api(path)
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [path, reloadCount]);

  // reload: دوباره از سرور بگیر (مثلاً بعد از ذخیره)
  function reload() {
    setReloadCount(reloadCount + 1);
  }

  return { data, loading, error, reload };
}

export default useFetch;
