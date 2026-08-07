import { apiUrl } from "./apiBase";

export async function fetchSdsById(id) {
  const encodedId = encodeURIComponent(id);
  const res = await fetch(apiUrl(`/api/sds/${encodedId}`));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json();
}