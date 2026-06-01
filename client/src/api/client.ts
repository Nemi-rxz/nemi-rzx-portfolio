const base = import.meta.env.VITE_API_URL || "";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json() as Promise<T>;
}

export const api = {
  getSite: () => request<import("../types").SiteContent>("/api/site"),
  getProjects: () => request<import("../types").Project[]>("/api/projects"),
  getProject: (slug: string) =>
    request<import("../types").Project>(`/api/projects/${slug}`),
  login: (email: string, password: string) =>
    request<{ ok: boolean; email: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  me: () => request<{ email: string }>("/api/auth/me"),
  adminGetProjects: () =>
    request<import("../types").Project[]>("/api/admin/projects"),
  adminCreateProject: (data: Partial<import("../types").Project>) =>
    request<import("../types").Project>("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  adminUpdateProject: (id: string, data: Partial<import("../types").Project>) =>
    request<import("../types").Project>(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  adminDeleteProject: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/projects/${id}`, { method: "DELETE" }),
  adminGetSite: () =>
    request<import("../types").SiteContent>("/api/admin/site"),
  adminUpdateSite: (data: Partial<import("../types").SiteContent>) =>
    request<import("../types").SiteContent>("/api/admin/site", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${base}/api/admin/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json() as Promise<{ url: string }>;
  },
};
