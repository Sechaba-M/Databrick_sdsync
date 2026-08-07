import { apiUrl } from "./apiBase";

/**
 * Safe token reader
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
 * error handler
 */
async function handleError(res) {
  let text = "";
  if (typeof res.text === "function") {
    text = await res.text();
  }

  if (text) {
    try {
      const json = JSON.parse(text);
      if (json.error) throw new Error(json.error);
      if (json.message) throw new Error(json.message);
    } catch {
      throw new Error(text);
    }
  }

  throw new Error("Request failed");
}

/**
 * 
 * UPDATE PROFILE
 * 
 */
export async function updateProfile(payload) {
  const token = getToken();

  let res;
  try {
    res = await fetch(apiUrl("/api/auth/profile"), {
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
    return handleError(res);
  }

  return res.json();
}

/**
 * 
 * CHANGE PASSWORD
 * 
 */
export async function changePassword(payload) {
  const token = getToken();

  let res;
  try {
    res = await fetch(apiUrl("/api/auth/change-password"), {
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
    return handleError(res);
  }

  return res.json();
}