import React from "react";
import { Filter, Search } from "lucide-react";

export default function SurveillanceFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  secondary,
  onSecondaryChange,
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search field */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chemical, CAS number or business unit..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-3">
          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#0B5794] focus:border-transparent
                       transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
            >
              <option value="all">All Categories</option>
              <option value="Legislative">Legislative</option>
              <option value="Best Practice">Best Practice</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Monitoring Type Filter */}
          {secondary !== undefined && (
            <div className="relative min-w-[200px]">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <select
                value={secondary}
                onChange={(e) => onSecondaryChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-sm 
                         focus:outline-none focus:ring-2 focus:ring-[#0B5794] focus:border-transparent
                         transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
              >
                <option value="all">All Monitoring Types</option>
                <option value="bio">Biological</option>
                <option value="air">Air Monitoring</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}