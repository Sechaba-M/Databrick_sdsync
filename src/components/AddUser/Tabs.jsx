import React from "react";
import { Users, UserPlus } from "lucide-react";

export default function Tabs({ activeTab, onChange, userCount = 0 }) {
  const tabs = [
    {
      id: "list",
      label: "User List",
      count: userCount,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "create",
      label: "Register New User",
      icon: <UserPlus className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`group relative flex items-center gap-2.5 px-6 sm:px-8 py-4 text-sm font-semibold transition-all duration-200
            ${
              activeTab === tab.id
                ? "text-blue-700"
                : "text-gray-600 hover:text-blue-600"
            }`}
        >
          {/* Active indicator bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#003E77] to-[#004A92] transition-all duration-200 ${
              activeTab === tab.id ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Background highlight */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent transition-opacity duration-200 ${
              activeTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          ></div>

          {/* Icon */}
          <div className={`relative transition-transform duration-200 ${
            activeTab === tab.id ? "scale-110" : "group-hover:scale-105"
          }`}>
            {tab.icon}
          </div>

          {/* Label */}
          <span className="relative">{tab.label}</span>

          {/* Count badge */}
          {tab.count !== undefined && (
            <span
              className={`relative ml-1 px-2.5 py-0.5 text-xs font-bold rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}