const base = import.meta.env.VITE_API_URL || "";
const authTokenKey = "nemi_admin_token";

function normalizeAssetUrl(url?: string | null) {
  if (!url) return "";
  if (
    !base ||
    /^https?:\/\//i.test(url) ||
    url.startsWith("data:") ||
    !url.startsWith("/uploads/")
  ) {
    return url;
  }
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function readToken() {
  try {
    return window.localStorage.getItem(authTokenKey);
  } catch {
    return null;
  }
}

function writeToken(token: string) {
  try {
    window.localStorage.setItem(authTokenKey, token);
  } catch {
    // Ignore storage errors and let the cookie fallback handle the session.
  }
}

function clearToken() {
  try {
    window.localStorage.removeItem(authTokenKey);
  } catch {
    // Ignore storage errors.
  }
}

function getAuthHeaders() {
  const token = readToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;

  const error = (payload as { error?: unknown }).error;
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const fieldErrors = (error as { fieldErrors?: Record<string, string[]> }).fieldErrors;
    if (fieldErrors) {
      const messages = Object.values(fieldErrors)
        .flat()
        .filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }
  }

  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  for (const [key, value] of Object.entries(getAuthHeaders())) {
    if (!headers.has(key)) headers.set(key, value);
  }

  const res = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error(getErrorMessage(payload, res.statusText || "Request failed"));
  }

  return payload as T;
}

function normalizeProject(project: import("../types").Project) {
  return { ...project, imageUrl: normalizeAssetUrl(project.imageUrl) };
}

function normalizeSite(site: import("../types").SiteContent) {
  return {
    ...site,
    heroAvatarUrl: normalizeAssetUrl(site.heroAvatarUrl),
    contactHeading: site.contactHeading || "Let's build something great together",
    footerNote:
      site.footerNote || "Available for freelance, partnerships, and digital product work.",
    services: (site.services || []).map((service) => ({
      ...service,
      imageUrl: normalizeAssetUrl(service.imageUrl),
    })),
    socialLinks: site.socialLinks || [],
    techIcons: site.techIcons || [],
    clientLogos: (site.clientLogos || []).map((logo) => normalizeAssetUrl(logo)),
  };
}

export const api = {
  getSite: async () => normalizeSite(await request<import("../types").SiteContent>("/api/site")),
  getProjects: async () =>
    (await request<import("../types").Project[]>("/api/projects")).map(normalizeProject),
  getProject: (slug: string) =>
    request<import("../types").Project>(`/api/projects/${slug}`).then(normalizeProject),
  async login(email: string, password: string) {
    const result = await request<{ ok: boolean; email: string; token?: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.token) writeToken(result.token);
    return result;
  },
  async logout() {
    try {
      return await request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    } finally {
      clearToken();
    }
  },
  me: () => request<{ email: string }>("/api/auth/me"),
  adminGetProjects: async () =>
    (await request<import("../types").Project[]>("/api/admin/projects")).map(normalizeProject),
  adminCreateProject: (data: Partial<import("../types").Project>) =>
    request<import("../types").Project>("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(normalizeProject),
  adminUpdateProject: (id: string, data: Partial<import("../types").Project>) =>
    request<import("../types").Project>(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then(normalizeProject),
  adminDeleteProject: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/projects/${id}`, { method: "DELETE" }),
  adminGetSite: async () =>
    normalizeSite(await request<import("../types").SiteContent>("/api/admin/site")),
  adminUpdateSite: (data: Partial<import("../types").SiteContent>) =>
    request<import("../types").SiteContent>("/api/admin/site", {
      method: "PUT",
      body: JSON.stringify(data),
    }).then(normalizeSite),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<{ url: string }>("/api/admin/upload", {
      method: "POST",
      body: form,
    }).then((result) => ({ url: normalizeAssetUrl(result.url) }));
  },
};
