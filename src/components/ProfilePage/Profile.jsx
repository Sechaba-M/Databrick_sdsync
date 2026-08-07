import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  IdCard,
  Edit,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import SdsyncTopBar from "../Navbar/NavBar";
import { updateProfile, changePassword } from "../../api/profileApi";

export default function Profile({ onLogout, isAdmin }) {
  const navigate = useNavigate();

  // Read session from localStorage
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem("session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: "",
    username: "",
    userId: "",
    businessUnit: "",
    contact: "",
    role: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    setSession(null);
    navigate("/", { replace: true });
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2]">
        <div className="animate-pulse text-[#003E77] font-semibold text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  const user = session.user || {};

  // Safely map fields (display values)
  const profile = useMemo(
    () => ({
      email: user.email || "N/A",
      username: user.username || "N/A",
      userId: user.id || user.userId || "N/A",
      businessUnit: user.businessUnit || "N/A",
      contact: user.contact || user.phone || "N/A",
      role: user.role || "N/A",
    }),
    [user]
  );

  // Keep edit form in sync with current profile/session
  useEffect(() => {
    setProfileForm({
      email: profile.email,
      username: profile.username === "N/A" ? "" : profile.username,
      userId: profile.userId,
      businessUnit: profile.businessUnit === "N/A" ? "" : profile.businessUnit,
      contact: profile.contact === "N/A" ? "" : profile.contact,
      role: profile.role === "N/A" ? "" : profile.role,
    });
  }, [profile]);

  // Fields with icons (read-only cards)
  const fields = [
    { label: "Email", value: profile.email, icon: Mail },
    { label: "Username", value: profile.username, icon: User },
    { label: "User ID", value: profile.userId, icon: IdCard },
    { label: "Business Unit", value: profile.businessUnit, icon: Building },
    { label: "Contact", value: profile.contact, icon: Phone },
    { label: "Role", value: profile.role, icon: Shield },
  ];

  // Get initials for avatar
  const initials =
    (profile.username &&
      profile.username !== "N/A" &&
      profile.username
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)) ||
    "U";

  const handleEditClick = () => {
    setProfileError("");
    setProfileMessage("");
    setIsEditingProfile((prev) => !prev);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setIsSavingProfile(true);

    try {
      const updatedUser = {
        email: profileForm.email,
        username: profileForm.username || user.username,
        businessUnit: profileForm.businessUnit,
        contact: profileForm.contact,
        phone: profileForm.contact,
        role: profileForm.role || user.role,
      };

      const res = await updateProfile(updatedUser);

      if (!res.success) {
        throw new Error(res.message || "Failed to update profile");
      }

      const newSession = {
        ...session,
        user: res.user || { ...user, ...updatedUser },
      };

      localStorage.setItem("session", JSON.stringify(newSession));
      setSession(newSession);

      setProfileMessage("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (err) {
      setProfileError(err.message || "Something went wrong updating profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password should be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to change password");
      }

      setPasswordMessage("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.message || "Something went wrong changing password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <SdsyncTopBar onLogout={onLogout || handleLogout} isAdmin={isAdmin} />

      <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2]">
        <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
       {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-200 overflow-hidden mb-6">
            {/* Avatar & Name Section */}
            <div className="relative px-5 sm:px-8 py-6 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#003E77] to-[#1F4E79] flex items-center justify-center shadow-xl border-4 border-white">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                </div>

                {/* Name & Role */}
                <div className="flex-1 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {profile.username}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-[#003E77] border border-blue-200">
                      <Shield className="w-4 h-4" />
                      {profile.role &&
                        profile.role !== "N/A" &&
                        profile.role.charAt(0).toUpperCase() +
                          profile.role.slice(1)}
                      {profile.role === "N/A" && "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                      <IdCard className="w-3 h-3" />
                      {profile.userId}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleEditClick}
                  className="sm:mb-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#003E77] hover:bg-[#1F4E79] text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>

              {/* Success/Error Messages */}
              {profileMessage && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileMessage}</span>
                </div>
              )}
              {profileError && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Edit Profile Form */}
              {isEditingProfile && (
                <form
                  aria-labelledby="edit-profile-heading"
                  data-testid="edit-profile-form"
                  onSubmit={handleSaveProfile}
                  className="mt-5 bg-gradient-to-br from-blue-50/50 to-gray-50 border border-blue-200 rounded-xl p-5"
                >
                  <h2
                    id="edit-profile-heading"
                    className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5 text-[#003E77]" />
                    Edit Profile Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-xs font-semibold text-gray-600 uppercase mb-1.5"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
                        Business Unit
                      </label>
                      <input
                        type="text"
                        name="businessUnit"
                        value={profileForm.businessUnit}
                        onChange={handleProfileInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={profileForm.contact}
                        onChange={handleProfileInputChange}
                        placeholder="+1-123-456-7890"
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={profileForm.role}
                        onChange={handleProfileInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-[#003E77] text-white hover:bg-[#1F4E79] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isSavingProfile ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Main Layout: Info + Security */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Information Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.label}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                        <Icon className="w-5 h-5 text-[#003E77]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                          {field.label}
                        </label>
                        <p className="text-sm font-medium text-gray-900 break-words">
                          {field.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Change Password Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
                    <Lock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Change Password
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-xs font-semibold text-gray-600 uppercase mb-1.5"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-xs font-semibold text-gray-600 uppercase mb-1.5"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-gray-600 uppercase mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordError && (
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                  {passwordMessage && (
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{passwordMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#003E77] text-white hover:bg-[#1F4E79] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}