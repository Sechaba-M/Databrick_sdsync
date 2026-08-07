import React, { useEffect, useState } from "react";
import { Key, User, Mail, Phone, Building2, Shield } from "lucide-react";

const PERMISSIONS = ["read", "write", "admin", "delete", "export"];

export default function UserForm({
  onSubmit,
  initialValues,
  isEditing,
  onCancelEdit,
  loading,
  businessUnits = [],
  loadingBusinessUnits = false,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    businessUnit: "",
    role: "",
    permissions: [],
    password: "",
  });
  const [customBusinessUnit, setCustomBusinessUnit] = useState("");

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        permissions: initialValues.permissions || [],
      }));
    }
  }, [initialValues]);

  useEffect(() => {
    if (!isEditing) {
      setForm((prev) => ({
        ...prev,
        username:
          (prev.firstName + prev.lastName).replace(/\s+/g, "").toLowerCase() ||
          "",
      }));
    }
  }, [form.firstName, form.lastName, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      const newPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).toUpperCase().slice(-5);

      setForm((prev) => ({
        ...prev,
        password: newPassword,
      }));
    }
  }, [isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function togglePermission(permission) {
    setForm((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <section className="p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-[#003E77] to-[#004A92] shadow-lg shadow-blue-500/30">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit User Profile" : "Register New User"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? "Update user information and permissions" : "Create a new user account with credentials"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Personal Information
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Account Information
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="userName"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Auto-generated from name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                readOnly={!isEditing}
              />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Auto-generated from first and last name
              </p>
            </div>
            <div>
              <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="emailAddress"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="user@company.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact & Organization Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Contact & Organization
          </h3>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-3.5 h-3.5 inline mr-1" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1-123-456-7890"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="businessUnit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Unit <span className="text-red-500">*</span>
              </label>

              <select
                id="businessUnit"
                name="businessUnit"
                value={form.businessUnit}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({ ...prev, businessUnit: value }));
                  setCustomBusinessUnit("");
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                disabled={loadingBusinessUnits}
                required
              >
                <option value="">
                  {loadingBusinessUnits ? "Loading..." : "Select Business Unit"}
                </option>

                {businessUnits.map((bu) => (
                  <option key={bu.id} value={bu.name}>
                    {bu.name}
                  </option>
                ))}

                <option value="__new__">+ Create new business unit</option>
              </select>

              {form.businessUnit === "__new__" && (
                <input
                  value={customBusinessUnit}
                  onChange={(e) => {
                    setCustomBusinessUnit(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      businessUnit: e.target.value,
                    }));
                  }}
                  placeholder="Enter new business unit name"
                  className="mt-3 w-full rounded-lg border border-blue-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
            </div>
            <div>
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                id="userRole"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400 cursor-pointer"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Viewer">Standard User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password Section (Create only) */}
        {!isEditing && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              Security Credentials
            </h3>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Auto-generated password"
                className="w-full rounded-lg border border-blue-300 px-4 py-2.5 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                required
              />
              <p className="text-xs text-blue-700 mt-2 flex items-center gap-1.5 bg-blue-100 px-3 py-2 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Auto-generated secure password (can be edited if needed)
              </p>
            </div>
          </div>
        )}

        {/* Permissions Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            User Permissions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PERMISSIONS.map((perm) => (
              <label
                key={perm}
                className="group relative flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={form.permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                />
                <span className="text-sm capitalize font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  {perm}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-gray-200">
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative px-8 py-3 rounded-lg bg-gradient-to-r from-[#003E77] to-[#004A92] text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
          >
            {loading && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
            <span className={loading ? "opacity-0" : ""}>
              {isEditing ? "Save Changes" : "Create User Profile"}
            </span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                Saving...
              </span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}