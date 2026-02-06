import { useEffect, useMemo, useState } from "react";
import "../App.css";

const API = "http://localhost:3000/api/user";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [toast, setToast] = useState({ type: "", text: "" });

  // create form
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  // edit modal
  const [editing, setEditing] = useState(null); // user object or null
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    status: "ACTIVE",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  function showToast(type, text) {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", text: "" }), 2500);
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Load users failed");
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("error", e.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const a = (u.username || "").toLowerCase();
      const b = (u.email || "").toLowerCase();
      const c = (u.firstname || "").toLowerCase();
      const d = (u.lastname || "").toLowerCase();
      const e = (u.status || "").toLowerCase();
      return (
        a.includes(term) ||
        b.includes(term) ||
        c.includes(term) ||
        d.includes(term) ||
        e.includes(term)
      );
    });
  }, [users, q]);

  async function createUser(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Create failed");

      showToast("ok", `Created: ${data?.id || "OK"}`);
      setForm(emptyForm);
      await loadUsers();
    } catch (e2) {
      showToast("error", e2.toString());
    } finally {
      setCreating(false);
    }
  }

  function openEdit(u) {
    setEditing(u);
    setEditForm({
      firstname: u.firstname ?? "",
      lastname: u.lastname ?? "",
      status: u.status ?? "ACTIVE",
      password: "",
    });
  }

  function closeEdit() {
    setEditing(null);
  }

  async function saveEdit() {
    if (!editing?._id) return;
    setSaving(true);
    try {
      const body = {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
        status: editForm.status,
      };
      if (editForm.password && editForm.password.trim() !== "") {
        body.password = editForm.password;
      }

      const res = await fetch(`${API}/${editing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");

      showToast("ok", "Updated");
      closeEdit();
      await loadUsers();
    } catch (e) {
      showToast("error", e.toString());
    } finally {
      setSaving(false);
    }
  }

  async function toggleSuspend(u) {
    if (!u?._id) return;
    const next = u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      const res = await fetch(`${API}/${u._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");

      showToast("ok", `Status: ${next}`);
      await loadUsers();
    } catch (e) {
      showToast("error", e.toString());
    }
  }

  async function deleteUser(u) {
    if (!u?._id) return;
    const ok = confirm(`Soft delete user: ${u.username || u.email}?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API}/${u._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      showToast("ok", "Deleted (soft)");
      await loadUsers();
    } catch (e) {
      showToast("error", e.toString());
    }
  }

  return (
    <div className="page">
      <div className="bgGlow" />

      <header className="topbar">
        <div>
          <div className="title">User Management</div>
        </div>

        <div className="rightTools">
          <div className="searchWrap">
            <input
              className="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search username / email / name / status..."
            />
            <button className="btn ghost" onClick={() => setQ("")}>
              Clear
            </button>
          </div>

          <button className="btn" onClick={loadUsers} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className="content">
        <section className="card">
          <div className="cardHeader">
            <div className="cardTitle">Create User</div>
            <div className="badge">{creating ? "Submitting..." : "POST /api/user"}</div>
          </div>

          <form className="formGrid" onSubmit={createUser}>
            <label className="field">
              <span>Username *</span>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span>Email *</span>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span>Password *</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
            </label>

            <label className="field">
              <span>Firstname</span>
              <input
                value={form.firstname}
                onChange={(e) => setForm((p) => ({ ...p, firstname: e.target.value }))}
              />
            </label>

            <label className="field">
              <span>Lastname</span>
              <input
                value={form.lastname}
                onChange={(e) => setForm((p) => ({ ...p, lastname: e.target.value }))}
              />
            </label>

            <div className="formActions">
              <button className="btn primary" type="submit" disabled={creating}>
                Create
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setForm(emptyForm)}
                disabled={creating}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="cardHeader">
            <div className="cardTitle">Users</div>
            <div className="badge">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 190 }}>Username</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Firstname</th>
                  <th style={{ width: 140 }}>Lastname</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 280 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="mutedCell">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="mutedCell">
                      No users found (or all are DELETED).
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u._id}>
                      <td className="mono">{u.username}</td>
                      <td className="mono">{u.email}</td>
                      <td>{u.firstname}</td>
                      <td>{u.lastname}</td>
                      <td>
                        <span className={`status ${String(u.status || "").toLowerCase()}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="rowActions">
                          <button className="btn small" onClick={() => openEdit(u)}>
                            Edit
                          </button>

                          <button
                            className="btn small"
                            onClick={() => toggleSuspend(u)}
                            title="Toggle ACTIVE / SUSPENDED"
                          >
                            {u.status === "SUSPENDED" ? "Activate" : "Suspend"}
                          </button>

                          <button className="btn small danger" onClick={() => deleteUser(u)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {toast.text && (
        <div className={`toast ${toast.type}`}>
          <span className="dot" />
          <span>{toast.text}</span>
        </div>
      )}

      {editing && (
        <div className="modalBackdrop" onClick={closeEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <div className="modalTitle">Edit User</div>
                <div className="modalSub mono">
                  {editing.username} • {editing.email}
                </div>
              </div>
              <button className="btn ghost" onClick={closeEdit}>
                Close
              </button>
            </div>

            <div className="modalBody">
              <label className="field">
                <span>Firstname</span>
                <input
                  value={editForm.firstname}
                  onChange={(e) => setEditForm((p) => ({ ...p, firstname: e.target.value }))}
                />
              </label>

              <label className="field">
                <span>Lastname</span>
                <input
                  value={editForm.lastname}
                  onChange={(e) => setEditForm((p) => ({ ...p, lastname: e.target.value }))}
                />
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </label>

              <label className="field">
                <span>New Password (optional)</span>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="leave blank to keep old password"
                />
              </label>
            </div>

            <div className="modalActions">
              <button className="btn primary" onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="btn ghost" onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}