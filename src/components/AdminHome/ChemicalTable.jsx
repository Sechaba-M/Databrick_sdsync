import React from "react";
import ChemicalRow from "./ChemicalRow";

/**
 * ChemicalTable renders:
 *  - table header
 *  - list of ChemicalRow components
 *  - "Showing X chemicals" caption
 *
 * It is scrollable horizontally on small screens to stay responsive.
 */
export default function ChemicalTable({
  chemicals,
  onViewChemical,
  onEditChemical,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
      {/* Caption */}
      <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Showing {chemicals.length} chemical{chemicals.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white">
          <thead className="bg-gradient-to-r from-[#003E77] to-[#004A92]">
            <tr>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Chemical Name
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                CAS Number
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Risk Level
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Safety Icons
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Hazards
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Monitoring Type
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Supplier
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-white/95">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {chemicals.length > 0 ? (
              chemicals.map((chem, index) => (
                <ChemicalRow
                  key={chem.id || `${chem.casNumber}-${index}`}
                  chemical={chem}
                  index={index}
                  onView={onViewChemical}
                  onEdit={onEditChemical}
                />
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No chemicals found</p>
                    <p className="text-xs text-gray-500">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}