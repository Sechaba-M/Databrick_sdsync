import React from "react";
import { Edit, Trash2, Mail, Phone } from "lucide-react";

export default function UserRow({ user, index, onEdit, onDelete }) {
  const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/50";

  return (
    <tr className={`${rowBg} hover:bg-blue-50/30 transition-colors duration-150`}>
      {/* User ID */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-mono font-semibold text-gray-700">
          {user.userId || `USR${String(index + 1).padStart(4, "0")}`}
        </span>
      </td>

      {/* Name */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-sm">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </td>

      {/* Username */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700 font-medium">
          @{user.username}
        </span>
      </td>

      {/* Business Unit */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          {user.businessUnit || "Production"}
        </span>
      </td>

      {/* Role */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-300 shadow-sm">
          {user.role || "Manager"}
        </span>
      </td>

      {/* Contact */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{user.phone}</span>
          </div>
        </div>
      </td>

      {/* Permissions */}
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {(user.permissions || []).length > 0 ? (
            user.permissions.map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 text-xs font-semibold shadow-sm"
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic font-medium">No permissions</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <Edit className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Edit
          </button>
          <button
            onClick={() => onDelete(user)}
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 hover:from-red-100 hover:to-rose-100 hover:border-red-300 hover:shadow-md transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}