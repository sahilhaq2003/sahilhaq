import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api.js";

export default function OverviewPage({ notify }) {
  const [stats, setStats] = useState(null);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getMessages({ limit: 5 })])
      .then(([s, m]) => {
        setStats(s);
        setLatest(m.items || []);
      })
      .catch((err) => notify(err.message, "error"));
  }, []);

  return (
    <div>
      <h1 style={{ margin: "0 0 1.25rem", fontSize: "1.6rem" }}>Overview</h1>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Projects</span>
          <strong>{stats ? stats.projects : "—"}</strong>
        </div>
        <div className="admin-stat">
          <span>Total Messages</span>
          <strong>{stats ? stats.totalMessages : "—"}</strong>
        </div>
        <div className="admin-stat">
          <span>Unread Messages</span>
          <strong>{stats ? stats.unreadMessages : "—"}</strong>
        </div>
        <div className="admin-stat">
          <span>Last 7 Days</span>
          <strong>{stats ? stats.recentMessages : "—"}</strong>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Latest Messages</h2>
          <Link to="/admin/messages" className="admin-btn admin-btn-outline">View All →</Link>
        </div>
        {latest.length === 0 ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>No messages yet.</p>
        ) : (
          latest.map((m) => (
            <div key={m._id} className={`admin-row ${!m.read ? "unread" : ""}`}>
              <div>
                <strong>{m.name}</strong> <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>({m.email})</span>
                <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                  {m.subject || m.message.slice(0, 80)}
                </div>
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
