import React, { useState, useEffect } from "react";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import { forgotPassword } from "../../api/forgotApi";

/**
 * ForgotPasswordModal
 *
 * 
 *  - open: boolean
 *  - onClose: function
 *  - onSuccess: function
 */
export default function ForgotPasswordModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setEmail("");
      setLoading(false);
      setError("");
      setSuccessMsg("");
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());

      setSuccessMsg(
        "If an account with that email exists, password reset instructions have been sent."
      );

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003E77] to-[#1F4E79] text-white px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Reset your password</h2>
                <p className="text-sm text-blue-100 mt-1">
                  Enter your email to receive reset instructions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="hover:bg-white/20 rounded-lg p-1.5 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email address <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                autoFocus
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="flex gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  {successMsg}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Check your inbox and spam folder
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#003E77] to-[#1F4E79] hover:from-[#1F4E79] hover:to-[#2B5F8F] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-600 text-center">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-[#003E77] font-semibold hover:underline disabled:opacity-50"
            >
              Back to login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
