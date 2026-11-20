const BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/$/, "");

async function req(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    headers: isForm ? options.headers : { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const adminApi = {
  login: (email, password) => req("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => req("/auth/logout", { method: "POST" }),
  me: () => req("/auth/me"),

  getStats: () => req("/admin/stats"),
  getProfile: () => req("/admin/profile"),
  updateProfile: (body) => req("/admin/profile", { method: "PUT", body: JSON.stringify(body) }),

  getMessages: ({ search = "", read = "", page = 1, limit = 15 } = {}) => {
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (read !== "") qs.set("read", read);
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    return req(`/admin/messages?${qs.toString()}`);
  },
  updateMessage: (id, body) => req(`/admin/messages/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteMessage: (id) => req(`/admin/messages/${id}`, { method: "DELETE" }),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return req("/admin/upload", { method: "POST", body: fd });
  },

  list: (resource) => req(`/admin/${resource}`),
  create: (resource, body) => req(`/admin/${resource}`, { method: "POST", body: JSON.stringify(body) }),
  update: (resource, id, body) => req(`/admin/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (resource, id) => req(`/admin/${resource}/${id}`, { method: "DELETE" }),
  reorder: (resource, items) => req(`/admin/${resource}/reorder`, { method: "PATCH", body: JSON.stringify(items) }),
};
