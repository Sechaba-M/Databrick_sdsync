import { apiUrl } from "./apiBase";

/**
 * Request password reset email
 */
export async function forgotPassword(email) {
  const res = await fetch(apiUrl("/api/auth/forgot-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to request password reset");
  }

  return res.json();
}

/**
 * Reset password using token
 */
export async function resetPassword(token, newPassword) {
  const res = await fetch(apiUrl("/api/auth/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to reset password");
  }

  return res.json();
}
