import { FormEvent, useEffect, useState } from "react";
import { api } from "../../api/client";
import type { SiteContent, Service, SocialLink } from "../../types";

export default function SiteAdmin() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.adminGetSite().then((s) => setSite(s as SiteContent)).catch((e) => setError(e.message));
  }, []);

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setSite((s) => (s ? { ...s, heroAvatarUrl: url } : null));
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!site) return;
    setError("");
    setSaved(false);
    try {
      await api.adminUpdateSite(site);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  function updateService(i: number, patch: Partial<Service>) {
    if (!site) return;
    const services = [...site.services];
    services[i] = { ...services[i], ...patch };
    setSite({ ...site, services });
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    if (!site) return;
    const socialLinks = [...site.socialLinks];
    socialLinks[i] = { ...socialLinks[i], ...patch };
    setSite({ ...site, socialLinks });
  }

  if (!site) return <div className="loading-screen">LOADING</div>;

  return (
    <>
      <div className="admin-header">
        <h1>Site content</h1>
        {saved && <span style={{ color: "var(--accent)" }}>Saved!</span>}
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="form-group">
          <label>Hero role</label>
          <input
            value={site.heroRole}
            onChange={(e) => setSite({ ...site, heroRole: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Hero name display</label>
          <input
            value={site.heroNameDisplay}
            onChange={(e) => setSite({ ...site, heroNameDisplay: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Hero bio</label>
          <textarea
            value={site.heroBio}
            onChange={(e) => setSite({ ...site, heroBio: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Hero Avatar URL</label>
          <input
            value={site.heroAvatarUrl || ""}
            onChange={(e) => setSite({ ...site, heroAvatarUrl: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: "0.5rem" }}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleAvatarUpload(f);
            }}
          />
        </div>
        <div className="form-group">
          <label>Value headline</label>
          <textarea
            value={site.valueHeadline}
            onChange={(e) => setSite({ ...site, valueHeadline: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Value body</label>
          <textarea
            value={site.valueBody}
            onChange={(e) => setSite({ ...site, valueBody: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Tech icons (comma-separated)</label>
          <input
            value={site.techIcons?.join(", ") || ""}
            onChange={(e) =>
              setSite({
                ...site,
                techIcons: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
          />
        </div>

        <h2 style={{ fontSize: "1rem", margin: "1.5rem 0 1rem" }}>Services</h2>
        {site.services.map((svc, i) => (
          <div key={i} className="service-edit-block">
            <div className="form-group">
              <label>Title</label>
              <input
                value={svc.title}
                onChange={(e) => updateService(i, { title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={svc.description}
                onChange={(e) => updateService(i, { description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                value={svc.imageUrl}
                onChange={(e) => updateService(i, { imageUrl: e.target.value })}
              />
            </div>
          </div>
        ))}

        <h2 style={{ fontSize: "1rem", margin: "1.5rem 0 1rem" }}>Social links</h2>
        {site.socialLinks.map((link, i) => (
          <div key={i} className="service-edit-block">
            <div className="form-group">
              <label>Platform</label>
              <input
                value={link.platform}
                onChange={(e) => updateSocial(i, { platform: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Label</label>
              <input
                value={link.label}
                onChange={(e) => updateSocial(i, { label: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                value={link.url}
                onChange={(e) => updateSocial(i, { url: e.target.value })}
              />
            </div>
          </div>
        ))}

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Save site content
        </button>
      </form>
    </>
  );
}
