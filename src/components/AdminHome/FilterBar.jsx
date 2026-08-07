import React from "react";
import { Search, Filter, Download, Plus } from "lucide-react";

/**
 * FilterBar component renders:
 *  - Search input
 *  - Dropdown filters (name, business unit, supplier)
 *  - Export and Add Chemical buttons
 *
 * Parent manages state for search/filter values and passes handlers down.
 * Options come from backend data.
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
  onAddChemical,

  nameOptions = [],
  businessUnitOptions = [],
  supplierOptions = [],
}) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/80 p-5 sm:p-6 backdrop-blur-sm">
      {/* First row: search + dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 mb-5">
        {/* Search input with icon inside */}
        <div className="relative group">
          <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chemical, CAS number..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>

        {/* Name filter (chemical names) */}
        <div className="relative group">
          <Filter className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors z-10" />
          <select
            value={nameFilter}
            onChange={(e) => onNameFilterChange(e.target.value)}
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-gray-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
          >
            <option value="all">All Names</option>
            {nameOptions.map((name) => (
              <option key={name} value={name.toLowerCase()}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Business unit filter */}
        <div className="relative group">
          <Filter className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors z-10" />
          <select
            value={businessUnitFilter}
            onChange={(e) => onBusinessUnitFilterChange(e.target.value)}
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-gray-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
          >
            <option value="all">All Business Units</option>
            {businessUnitOptions.map((unit) => (
              <option key={unit} value={unit.toLowerCase()}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier filter */}
        <div className="relative group">
          <Filter className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors z-10" />
          <select
            value={supplierFilter}
            onChange={(e) => onSupplierFilterChange(e.target.value)}
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-gray-400"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem'
            }}
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

      {/* Second row: export + add chemical buttons aligned right */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onExport}
          className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-4 h-4 group-hover:animate-bounce" />
          Export
        </button>
        {onAddChemical && (
          <button
            type="button"
            onClick={onAddChemical}
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Add Chemical
          </button>
        )}
      </div>
    </div>
  );
}