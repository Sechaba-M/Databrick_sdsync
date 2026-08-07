import { apiUrl } from "./apiBase";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
}

export function fetchChemicalSurveillance() {
  return fetchJson(apiUrl("/api/surveillance/chemicals"));
}

export function fetchBusinessUnitSurveillance() {
  return fetchJson(apiUrl("/api/surveillance/business-units"));
}
