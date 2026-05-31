import { FormEvent, useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Project } from "../../types";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  tools: "",
  imageUrl: "",
  projectUrl: "",
  featured: false,
  published: true,
  order: 0,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function load() {
    api.adminGetProjects().then(setProjects).catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      tools: form.tools.split(",").map((t) => t.trim()).filter(Boolean),
      order: Number(form.order),
    };
    try {
      if (editingId) {
        await api.adminUpdateProject(editingId, payload);
      } else {
        await api.adminCreateProject(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  function startEdit(p: Project) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      tools: p.tools?.join(", ") || "",
      imageUrl: p.imageUrl,
      projectUrl: p.projectUrl,
      featured: p.featured,
      published: p.published,
      order: p.order,
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await api.adminDeleteProject(id);
    load();
  }

  return (
    <>
      <div className="admin-header">
        <h1>Projects</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", maxWidth: 560 }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          {editingId ? "Edit project" : "Add project"}
        </h2>
        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Tools (comma-separated)</label>
          <input
            value={form.tools}
            onChange={(e) => setForm({ ...form, tools: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: "0.5rem" }}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </div>
        <div className="form-group">
          <label>Project URL</label>
          <input
            value={form.projectUrl}
            onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Order</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.published ? "Yes" : "No"}</td>
              <td className="admin-actions">
                <button type="button" className="btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => remove(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
