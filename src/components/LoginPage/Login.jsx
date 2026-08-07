import React, { useState } from "react";
import ForgotPasswordModal from "../ForgotPassword/ForgotPassword";
import { login } from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      const session = {
        token: data.token,
        user: data.user,
        mustChangePassword: data.mustChangePassword,
      };

      localStorage.setItem("session", JSON.stringify(session));

      if (onLogin) {
        onLogin(session);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#5C99D2] px-4">
      <div className="w-full max-w-md bg-[#DEEFFF] shadow-2xl rounded-3xl p-8 space-y-6">
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-[#1F4E79] to-[#0080FF] text-transparent bg-clip-text tracking-wide">
            SDSYNC
          </h1>
          <h2 className="text-xl font-semibold bg-gradient-to-br from-[#1F4E79] to-[#0080FF] text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to your account
          </p>
        </header>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border-2 border-gray-300 bg-[#DEEFFF] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5C8A]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900">
              Password
            </label>

            {/* Password field with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border-2 border-gray-300 bg-[#DEEFFF] px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5C8A]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-[#3A9BD9] hover:underline text-sm font-medium"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#2E5C8A] to-[#3A9BD9] text-white py-3.5 text-base font-bold hover:from-[#254A6F] hover:to-[#2E7FB5] disabled:opacity-60 shadow-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <ForgotPasswordModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </div>
  );
}
