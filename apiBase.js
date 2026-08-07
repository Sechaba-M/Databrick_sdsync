export const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path = "") {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export const buildUrl = apiUrl;

