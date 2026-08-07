const viteEnv = globalThis.__SDSYNC_ENV__ ?? {};

export const API_BASE = viteEnv.VITE_API_BASE_URL || "";

export function apiUrl(path = "") {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export const buildUrl = apiUrl;
