import React from "react";
import { Users } from "lucide-react";
import UserTable from "./UserTable";

export default function UserList({ users, onEditUser, onDeleteUser }) {
  return (
    <section className="p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-[#003E77] to-[#004A92] shadow-lg shadow-blue-500/30">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Registered Users
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage all user accounts
          </p>
        </div>
      </div>
      <UserTable
        users={users}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      />
    </section>
  );
}