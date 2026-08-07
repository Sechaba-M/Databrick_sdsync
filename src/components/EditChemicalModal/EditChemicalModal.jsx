import React, { useState, useEffect } from "react";

/**
 * EditChemicalModal
 *
 * Allows user/admin to:
 *  - Change monitoring type
 *  - Delete the chemical
 *
 * 
 *  - Admin can delete from all databases or a specific business unit
 *  - Normal user can only delete / edit chemicals in their database
 *
 * For admins
 *  - "all"  → delete from all business units
 *  - "<BU>" → delete from that specific business unit
 */
export default function EditChemicalModal({
  isOpen,
  chemical,
  isAdmin,
  loading = false,
  onClose,
  onDelete,
}) {
  const [businessUnitScope, setBusinessUnitScope] = useState("all");
  if (!isOpen || !chemical) return null;
  const handleDeleteClick = () => {
    let scopeText;

    if (isAdmin) {
      if (businessUnitScope === "all") {
        scopeText =
          "This will delete this chemical from ALL business units / databases. This action cannot be undone.";
      } else {
        scopeText = `This will delete this chemical from the business unit "${businessUnitScope}" only. This action cannot be undone.`;
      }
    } else {
      scopeText =
        "This will delete this chemical from YOUR database. This action cannot be undone.";
    }

    if (
      window.confirm(
        `${scopeText}\n\nAre you sure you want to delete "${chemical.name}"?`
      )
    ) {
      // pass the chosen scope; existing onDelete handlers can choose
      onDelete(businessUnitScope);
    }
  };

  // Helper: extract possible business units from the chemical object
  const businessUnits = Array.isArray(chemical.businessUnits)
    ? chemical.businessUnits
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Chemical
        </h2>

        <div className="mb-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Name:</span> {chemical.name}
          </div>
          <div>
            <span className="font-medium">CAS:</span> {chemical.casNumber}
          </div>
        </div>
        <div className="mb-4 text-sm text-gray-700">
     <div>
        <span className="font-medium">Monitoring Type:</span>{" "}
          {chemical.monitoringType || "—"}
        </div>
      </div>

        {/* Danger zone: delete */}
        <div className="mt-5 border-t border-gray-200 pt-4">
          {isAdmin && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Delete Scope (Admin Only)
              </label>
              <select
                value={businessUnitScope}
                onChange={(e) => setBusinessUnitScope(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/70"
              >
                <option value="all">All business units</option>
                {businessUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-gray-500">
                Choose whether to delete this chemical from all business units
                or only a specific one.
              </p>
            </div>
          )}

          <p className="text-xs text-red-700 mb-2">
            {isAdmin
              ? "As an admin, you can delete this chemical from ALL business units or a specific business unit, depending on the selection above."
              : "Deleting this chemical will remove it from YOUR database only (subject to backend permissions)."}
          </p>

          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-xs sm:text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Chemical"}
          </button>
        </div>
      </div>
    </div>
  );
}
