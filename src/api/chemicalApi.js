import { apiUrl } from "./apiBase";

/**
 * Safe token reader (auth optional)
 */
function getToken() {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

/**
 * Build query string, ignoring null/undefined/empty/"all"
 */
function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "all"
    ) {
      return;
    }
    qs.append(key, value);
  });
  return qs.toString() ? `?${qs}` : "";
}

/**
 *  error handler
 */
async function handleError(res, fallback) {
  let text = "";
  if (typeof res.text === "function") {
    text = await res.text();
  }

  if (text) throw new Error(text);
  throw new Error(fallback);
}

/**
 * 
 * FETCH CHEMICALS
 * 
 */
export async function fetchChemicals(params = {}) {
  let res;
  try {
    res = await fetch(apiUrl(`/api/chemicals${buildQuery(params)}`));
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    let text = "";
    if (typeof res.text === "function") {
      text = await res.text();
    }
    if (text) throw new Error(text);
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

/**
 * 
 * CREATE CHEMICAL
 * 
 */
export async function createChemical(payload) {
  const token = getToken();

  let res;
  try {
    res = await fetch(apiUrl("/api/chemicals"), {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    return handleError(res, "Request failed");
  }

  return res.json();
}

/**
 * 
 * UPDATE CHEMICAL
 * 
 */
export async function updateChemical(id, payload) {
  const token = getToken();

  let res;
  try {
    res = await fetch(apiUrl(`/api/chemicals/${id}`), {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    return handleError(res, "Request failed");
  }

  return res.json();
}

/**
 * 
 * DELETE CHEMICAL
 * 
 */
export async function deleteChemical(id) {
  const token = getToken();

  let res;
  try {
    res = await fetch(apiUrl(`/api/chemicals/${id}`), {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    let text = "";
    if (typeof res.text === "function") {
      text = await res.text();
    }
    if (text) throw new Error(text);
    throw new Error(`Failed to delete chemical (status ${res.status})`);
  }

  return true;
}

/**
 * 
 * EXPORT CHEMICALS
 * 
 */
export async function exportChemicals(params = {}) {
  const token = getToken();

  let res;
  try {
    res = await fetch(
      apiUrl(`/api/chemicals/export${buildQuery(params)}`),
      {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    let text = "";
    if (typeof res.text === "function") {
      text = await res.text();
    }
    if (text) throw new Error(text);
    throw new Error("Failed to export chemicals");
  }

  if (typeof res.blob !== "function") {
    throw new Error("Export failed");
  }

  return res.blob();
}