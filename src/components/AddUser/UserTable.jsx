import React from "react";
import UserRow from "./UserRow";

export default function UserTable({ users, onEditUser, onDeleteUser }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg bg-white">
      {/* Table Caption */}
      <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            {users.length}
          </span>
          {users.length === 1 ? "User" : "Users"} Total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#003E77] to-[#004A92]">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                User ID
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Name
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Username
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Business Unit
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Role
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Contact
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                Permissions
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">No users found</p>
                    <p className="text-sm text-gray-500">Create one from the "Register New User" tab</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <UserRow
                  key={user.id || index}
                  user={user}
                  index={index}
                  onEdit={onEditUser}
                  onDelete={onDeleteUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}