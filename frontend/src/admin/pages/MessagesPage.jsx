import { useEffect, useState } from "react";
import { adminApi } from "../api.js";
import { ConfirmButton } from "../components/AdminUI.jsx";

export default function MessagesPage({ notify }) {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, [search, filter, page]);

  async function load() {
    try {
      const res = await adminApi.getMessages({ search, read: filter, page, limit: 15 });
      setData(res);
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function toggleRead(m) {
    try {
      const updated = await adminApi.updateMessage(m._id, { read: !m.read });
      if (selected?._id === m._id) setSelected(updated);
      notify(updated.read ? "Marked as read" : "Marked as unread");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await adminApi.deleteMessage(id);
      if (selected?._id === id) setSelected(null);
      notify("Message deleted");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 1.25rem", fontSize: "1.6rem" }}>Messages ({data.total})</h1>

      <div className="admin-card" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          className="admin-input"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Search name, email, subject..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="admin-select"
          style={{ width: "160px" }}
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {selected && (
        <div className="admin-card" style={{ borderColor: "var(--acc)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem" }}>{selected.subject || "No subject"}</h3>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted)" }}>
                From <strong>{selected.name}</strong> ({selected.email}) · {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "Portfolio Contact"}`)}`}
                className="admin-btn admin-btn-accent"
              >
                Reply ↗
              </a>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
          <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{selected.message}</p>
        </div>
      )}

      {data.items.map((m) => (
        <div key={m._id} className={`admin-row ${!m.read ? "unread" : ""}`}>
          <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelected(m)}>
            <div style={{ fontWeight: 600 }}>
              {m.name} <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: "0.85rem" }}>({m.email})</span>
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.2rem" }}>
              {m.subject ? `${m.subject} — ` : ""}{m.message.slice(0, 90)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => toggleRead(m)}>
              {m.read ? "Mark Unread" : "Mark Read"}
            </button>
            <ConfirmButton onConfirm={() => remove(m._id)} />
          </div>
        </div>
      ))}

      {data.pages > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
          <button type="button" className="admin-btn admin-btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}>Page {page} of {data.pages}</span>
          <button type="button" className="admin-btn admin-btn-outline" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
