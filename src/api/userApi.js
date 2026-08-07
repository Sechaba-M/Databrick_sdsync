import { apiUrl } from "./apiBase";

/**
 * Token helpers
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

function requireToken() {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated – no token found.");
  }
  return token;
}

/**
 * Unified error handler
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

  throw new Error(`Request failed with status ${res.status}`);
}

/**
 * 
 * USERS
 * 
 */

/**
 * Fetch all users (admin)
 */
export async function fetchUsers() {
  const token = requireToken();

  const res = await fetch(apiUrl("/api/auth/users"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return handleError(res);
  }

  const data = await res.json();
  return data?.data ?? data ?? [];
}

/**
 * Create user (admin)
 */
export async function createUser(payload) {
  const token = requireToken();

  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return handleError(res);
  }

  const data = await res.json();
  return data?.user ?? data ?? null;
}

/**
 * Update user
 */
export async function updateUser(id, payload) {
  const token = requireToken();

  const res = await fetch(apiUrl(`/api/auth/users/${id}`), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return handleError(res);
  }

  const data = await res.json();
  return data?.user ?? data ?? null;
}

/**
 * Delete user
 */
export async function deleteUser(id) {
  const token = requireToken();

  const res = await fetch(apiUrl(`/api/auth/users/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return handleError(res);
  }

  return true;
}

/**
 * Fetch all business units
 */
export async function fetchBusinessUnits() {
  const token = requireToken();

  const res = await fetch(apiUrl("/api/business-units"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return handleError(res);
  }

  const data = await res.json();
  return data?.data ?? [];
}

/**
 * Create new business unit
 */
export async function createBusinessUnit(name) {
  const token = requireToken();

  const res = await fetch(apiUrl("/api/business-units"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    return handleError(res);
  }

  const data = await res.json();
  return data?.data ?? data;
}

