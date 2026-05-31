import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/client";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => setEmail(u.email))
      .catch(() => navigate("/admin/login"))
      .finally(() => setChecking(false));
  }, [navigate]);

  async function logout() {
    await api.logout();
    navigate("/admin/login");
  }

  if (checking) {
    return <div className="loading-screen">LOADING</div>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>EN Admin</h2>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          {email}
        </p>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Projects
          </NavLink>
          <NavLink to="/admin/site">Site content</NavLink>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </nav>
        <a href="/" style={{ display: "block", marginTop: "2rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          View site →
        </a>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
