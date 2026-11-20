const BASE = (import.meta.env?.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  getPortfolio: () => request("/portfolio"),
  sendMessage: (body) => request("/messages", { method: "POST", body: JSON.stringify(body) }),

  verifyAdmin: (key) =>
    request("/admin/verify", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": key } }),
  updateProfile: (key, body) =>
    request("/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify(body) }),

  getProjects: () => request("/projects"),
  createProject: (key, body) =>
    request("/projects", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify(body) }),
  updateProject: (key, id, body) =>
    request(`/projects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify(body) }),
  deleteProject: (key, id) =>
    request(`/projects/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": key } }),

  getMessages: (key) =>
    request("/messages", { headers: { "Content-Type": "application/json", "x-admin-key": key } }),
  updateMessage: (key, id, body) =>
    request(`/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify(body) }),
  deleteMessage: (key, id) =>
    request(`/messages/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-key": key } }),
};
