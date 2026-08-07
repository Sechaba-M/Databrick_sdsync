import { apiUrl } from "./apiBase";

async function handleResponse(res) {
  // AUTO LOGOUT ON INACTIVITY / EXPIRED SESSION
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired due to inactivity");
  }

  if (!res.ok) {
    const text = await res.text();

    // error message
    if (res.status === 400 || res.status === 403) {
      throw new Error("Invalid email or password");
    }

    try {
      const json = JSON.parse(text);
      throw new Error(json.error || json.message || "Request failed");
    } catch {
      throw new Error("Request failed");
    }
  }

  const data = await res.json();

  if (data?.success === false) {
    throw new Error("Invalid email or password");
  }

  return data;
}


const BASE = apiUrl("/api/auth");

export async function login(payload) {
  let res;
  try {
    res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  return handleResponse(res);
}

export async function registerUser(payload) {
  let res;
  try {
    res = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  return handleResponse(res);
}

export async function fetchProfile(token) {
  let res;
  try {
    res = await fetch(`${BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err;
  }

  return handleResponse(res);
}
