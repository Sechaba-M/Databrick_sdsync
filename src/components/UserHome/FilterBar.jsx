import React from "react";
import { Search, Filter, Download } from "lucide-react";

/**
 * FilterBar component renders:
 *  - Search input
 *  - Dropdown filters (name, business unit, supplier)
 *  - Export button
 *
 * Options are provided by backend through props.
 */

export default function FilterBar({
  searchValue,
  onSearchChange,

  nameFilter,
  onNameFilterChange,

  businessUnitFilter,
  onBusinessUnitFilterChange,

  supplierFilter,
  onSupplierFilterChange,

  onExport,

  // props coming from backend:
  nameOptions = [],
  supplierOptions = [],
  businessUnitOptions = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
      {/* First row: search + dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3 mb-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chemical, CAS number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Name filter */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={nameFilter}
            onChange={(e) => onNameFilterChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Chemicals</option>
            {nameOptions.map((name) => (
              <option key={name} value={name.toLowerCase()}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Business Unit filter */}
        {businessUnitFilter !== undefined && (
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={businessUnitFilter}
              onChange={(e) => onBusinessUnitFilterChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Business Units</option>
              {businessUnitOptions.map((unit) => (
                <option key={unit} value={unit.toLowerCase()}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Supplier filter */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={supplierFilter}
            onChange={(e) => onSupplierFilterChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Suppliers</option>
            {supplierOptions.map((supplier) => (
              <option key={supplier} value={supplier.toLowerCase()}>
                {supplier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second row: export button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}

