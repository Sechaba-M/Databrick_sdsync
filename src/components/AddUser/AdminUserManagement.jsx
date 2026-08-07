import React, { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import Tabs from "./Tabs";
import UserList from "./UserList";
import UserForm from "./UserForm";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchBusinessUnits,
  createBusinessUnit,
} from "../../api/userApi";

import SdsyncTopBar from "../Navbar/NavBar";

export default function AdminUserManagement({ onLogout, isAdmin }) {
  const [activeTab, setActiveTab] = useState("list");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // for Edit
  const [error, setError] = useState(null);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [loadingBusinessUnits, setLoadingBusinessUnits] = useState(false);


  // Load users from API when component mounts
  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      setError(null);

      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Could not load users from the backend. Check your API");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

      useEffect(() => {
      async function loadBusinessUnits() {
        setLoadingBusinessUnits(true);
        try {
          const data = await fetchBusinessUnits();
          setBusinessUnits(data);
        } catch (err) {
          console.error("Failed to load business units", err);
          setBusinessUnits([]);
        } finally {
          setLoadingBusinessUnits(false);
        }
      }

      loadBusinessUnits();
    }, []);


  // When clicking Edit in the table
  function handleEditUser(user) {
    setSelectedUser(user);
    setActiveTab("create"); // jump to form tab in "edit" mode
  }

  // When cancelling edit from form
  function handleCancelEdit() {
    setSelectedUser(null);
  }

  // Create or update user
  async function handleSubmitUser(formData) {
  setSavingUser(true);
  setError(null);

  try {
    let businessUnitName = formData.businessUnit;

    // Create business unit if it does not exist
    if (
      businessUnitName &&
      !businessUnits.some((bu) => bu.name === businessUnitName)
    ) {
      const createdBU = await createBusinessUnit(businessUnitName);
      setBusinessUnits((prev) => [...prev, createdBU]);
    }

    if (selectedUser) {
      //update user
      const updated = await updateUser(selectedUser.id, {
        ...formData,
        role: formData.role === "Admin" ? "admin" : "user",
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updated : u))
      );
    } else {
      // creta user
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role === "Admin" ? "admin" : "user",
        is_active: true,
        must_change_password: true,
        businessUnit: businessUnitName,
      };

      const created = await createUser(payload);
      setUsers((prev) => [...prev, created]);
    }

    setSelectedUser(null);
    setActiveTab("list");
  } catch (err) {
    console.error(err);
    setError("Saving user failed. Check backend logs.");
  } finally {
    setSavingUser(false);
  }
}



  // Delete user
  async function handleDeleteUser(user) {
    const confirmed = window.confirm(
      `Delete user "${user.firstName} ${user.lastName}"?`
    );
    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error(err);
      setError("Deleting user failed. Check your backend.");
    }
  }

  return (
    <>
      <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2] px-3 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/60 rounded-2xl border border-blue-200 shadow-md overflow-hidden">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-5 border-b border-gray-200 bg-white/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[#003E77] to-[#004A92] text-white shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Admin User Management
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Manage user accounts, roles, and permissions
                  </p>
                </div>
              </div>
            </header>

            {/* Tabs */}
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              userCount={users.length}
            />
            {/* Content area */}
            {activeTab === "list" ? (
              loadingUsers ? (
                <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">
                  Loading users...
                </div>
              ) : (
                <UserList
                  users={users}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              )
            ) : (
              <UserForm
                onSubmit={handleSubmitUser}
                initialValues={selectedUser}
                isEditing={!!selectedUser}
                onCancelEdit={handleCancelEdit}
                loading={savingUser}
                businessUnits={businessUnits}
                loadingBusinessUnits={loadingBusinessUnits}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}