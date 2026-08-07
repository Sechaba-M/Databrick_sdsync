import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/forgotApi";

export function ResetPasswordForm({ token }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function validate() {
    if (!token || token === "undefined") {
      setError("Reset link is invalid or has expired.");
      return false;
    }
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(token, newPassword);

      setSuccessMsg("Password reset successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6695C3] px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0066CC]">
          Reset Password
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0066CC] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating…" : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading}
            className="w-full text-sm text-[#0066CC] hover:underline"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Route: /reset-password/:token
 */
export default function ResetPasswordPage() {
  const { token } = useParams();
  return <ResetPasswordForm token={token} />;
}
