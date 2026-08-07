import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import {
  fetchChemicals,
  createChemical,
  updateChemical,
  deleteChemical,
  exportChemicals,
} from "../../api/chemicalApi";
import FilterBar from "./FilterBar";
import ChemicalTable from "./ChemicalTable";
import PaginationControls from "./PaginationControls";
import AddChemicalModal from "../AddNewChemical/AddChemicalModal";
import SdsyncTopBar from "../Navbar/NavBar";
import EditChemicalModal from "../EditChemicalModal/EditChemicalModal";

/**
 * ChemicalDashboardPage is the main container for the screen.
 * It:
 *  - Loads data from backend API
 *  - Holds state for search/filters
 *  - Handles pagination on the client side
 *  - Connects "View" / "Edit" / "Export" / "Add Chemical" buttons to callbacks
 */
export default function ChemicalDashboardPage({ onLogout, isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const exportMenuRef = useRef(null);

  // Raw list of chemicals from API
  const [chemicals, setChemicals] = useState([]);

  // Filters (search + dropdowns)
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("all");
  const [businessUnitFilter, setBusinessUnitFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // Pagination (client side)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // show 12 per page

  // Error state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add-chemical modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingNew, setSavingNew] = useState(false);

  // Edit-chemical modal state
  const [editingChemical, setEditingChemical] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingChemical, setDeletingChemical] = useState(false);

  // Export menu + exporting state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ---------------------------------------------------------------------------
  // Load chemicals from backend
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadChemicals() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChemicals();
        setChemicals(data);
      } catch (err) {
        console.error("[fetchChemicals error]", err);
        setError("Could not load chemicals from the backend. Check your API");
        setChemicals([]);
      } finally {
        setLoading(false);
      }
    }

    loadChemicals();
  }, []);

  //Clears Search when moving on to different page
  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [location.pathname]);

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showExportMenu]);

  // ---------------------------------------------------------------------------
  // Derive filter options from backend data
  // ---------------------------------------------------------------------------
  const nameOptions = Array.from(
    new Set(
      chemicals
        .map((c) => c.name)
        .filter(Boolean)
    )
  );

  const supplierOptions = Array.from(
    new Set(
      chemicals
        .map((c) => c.supplier)
        .filter(Boolean)
    )
  );

  const businessUnitOptions = Array.from(
    new Set(
      chemicals
        .flatMap((c) =>
          Array.isArray(c.businessUnits) ? c.businessUnits : []
        )
        .filter(Boolean)
    )
  );

  // ---------------------------------------------------------------------------
  // Apply filters on the client side
  // ---------------------------------------------------------------------------
  const filteredChemicals = chemicals.filter((chem) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      !searchLower ||
      (chem.name || "").toLowerCase().includes(searchLower) ||
      (chem.casNumber || "").toLowerCase().includes(searchLower);

    const matchesName =
      nameFilter === "all" ||
      (chem.name || "").toLowerCase() === nameFilter;

    const matchesBusinessUnit =
      businessUnitFilter === "all" ||
      (Array.isArray(chem.businessUnits) &&
        chem.businessUnits.some(
          (unit) =>
            typeof unit === "string" &&
            unit.toLowerCase() === businessUnitFilter
        ));

    const matchesSupplier =
      supplierFilter === "all" ||
      (chem.supplier || "").toLowerCase().includes(supplierFilter);

    return (
      matchesSearch && matchesName && matchesBusinessUnit && matchesSupplier
    );
  });

  // ---------------------------------------------------------------------------
  // Pagination logic
  // ---------------------------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(filteredChemicals.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const pagedChemicals = filteredChemicals.slice(
    startIndex,
    startIndex + pageSize
  );

  // ---------------------------------------------------------------------------
  // View / Edit handlers
  // ---------------------------------------------------------------------------
  function handleViewChemical(chemical) {
    // Navigate to SDS page for that chemical
    navigate(`/sds/${chemical.id}`);
  }

  function handleEditChemical(chemical) {
    // Open the edit modal for this chemical
    setEditingChemical(chemical);
  }

  function handleCloseEditModal() {
    setEditingChemical(null);
    setSavingEdit(false);
    setDeletingChemical(false);
  }

  // Save monitoring type change
  async function handleSaveMonitoringType(newMonitoringType) {
    if (!editingChemical) return;

    try {
      setSavingEdit(true);
      setError(null);

      const payload = {
        ...editingChemical,
        monitoringType: newMonitoringType,
      };

      const updated = await updateChemical(editingChemical.id, payload);

      // Update local state with returned object
      setChemicals((prev) =>
        prev.map((c) =>
          c.id === editingChemical.id ? { ...c, ...updated } : c
        )
      );

      handleCloseEditModal();
    } catch (err) {
      console.error("[updateChemical error]", err);
      setError(
        err.message ||
          "Failed to update chemical. Please check your backend or try again."
      );
    } finally {
      setSavingEdit(false);
    }
  }

  // Delete chemical
  async function handleDeleteCurrentChemical(scope) {
    if (!editingChemical) return;

    try {
      setDeletingChemical(true);
      setError(null);

      await deleteChemical(editingChemical.id);

      // Remove from local list
      setChemicals((prev) =>
        prev.filter((c) => c.id !== editingChemical.id)
      );

      handleCloseEditModal();
    } catch (err) {
      console.error("[deleteChemical error]", err);
      setError(
        err.message ||
          "Failed to delete chemical. Please check your backend permissions or try again."
      );
      setDeletingChemical(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Export helpers
  // ---------------------------------------------------------------------------

  // open/close menu when Export button is clicked
  function handleOpenExportMenu() {
    setShowExportMenu((prev) => !prev);
  }

  // Build CSV text from the current page chemicals
  function buildCsvFromChemicals(list) {
    const headers = [
      "ID",
      "Name",
      "CAS Number",
      "Risk Level",
      "Hazards",
      "Monitoring Type",
      "Supplier",
    ];

    const escapeCell = (value) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map((c) => [
      c.id ?? "",
      c.name ?? "",
      c.casNumber ?? "",
      c.riskLevel ?? "",
      Array.isArray(c.hazards) ? c.hazards.join(" | ") : c.hazards ?? "",
      c.monitoringType ?? "",
      c.supplier ?? "",
    ]);

    const csvLines = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

    return csvLines;
  }

  function createCsvBlob(list, asExcel = false) {
    const csv = buildCsvFromChemicals(list);
    const type = asExcel
      ? "application/vnd.ms-excel;charset=utf-8;"
      : "text/csv;charset=utf-8;";
    return new Blob([csv], { type });
  }

  function triggerDownloadBlob(blob, format) {
    const ext =
      format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf";
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chemicals_page-${currentPageSafe}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Fallback PDF export: open printable table and let user "Save as PDF"
  function exportPageAsPrintablePdf(list) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableRows = list
      .map((c) => {
        return `
          <tr>
            <td>${c.id ?? ""}</td>
            <td>${c.name ?? ""}</td>
            <td>${c.casNumber ?? ""}</td>
            <td>${c.riskLevel ?? ""}</td>
            <td>${
              Array.isArray(c.hazards) ? c.hazards.join(" | ") : c.hazards ?? ""
            }</td>
            <td>${c.monitoringType ?? ""}</td>
            <td>${c.supplier ?? ""}</td>
          </tr>
        `;
      })
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Chemicals Export - Page ${currentPageSafe}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 16px; }
            h3 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 4px 6px; font-size: 12px; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h3>Chemicals on Page ${currentPageSafe}</h3>
          <p style="font-size:11px;color:#555;">Use your browser's "Save as PDF" option in the print dialog.</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>CAS Number</th>
                <th>Risk Level</th>
                <th>Hazards</th>
                <th>Monitoring Type</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  // Main export handler for a specific format
  async function handleExportFormat(format) {
    setShowExportMenu(false);

    if (!pagedChemicals || pagedChemicals.length === 0) {
      setError("No data to export for the current page.");
      return;
    }

    setExporting(true);
    setError(null);

    try {
      // Try backend export first
      try {
        const params = {
          format,
          search: searchTerm || undefined,
          name: nameFilter !== "all" ? nameFilter : undefined,
          businessUnit:
            businessUnitFilter !== "all" ? businessUnitFilter : undefined,
          supplier: supplierFilter !== "all" ? supplierFilter : undefined,
          page: currentPageSafe,
          pageSize,
        };

        const blob = await exportChemicals(params);
        triggerDownloadBlob(blob, format);
        return;
      } catch (err) {
        console.error("[exportChemicals backend error]", err);
        setError(
          "Backend export failed. Falling back to browser export for this page."
        );
      }

      // Client-side export fallback
      if (format === "csv") {
        const blob = createCsvBlob(pagedChemicals, false);
        triggerDownloadBlob(blob, "csv");
      } else if (format === "excel") {
        const blob = createCsvBlob(pagedChemicals, true);
        triggerDownloadBlob(blob, "excel");
      } else if (format === "pdf") {
        exportPageAsPrintablePdf(pagedChemicals);
      }
    } catch (err) {
      console.error("[handleExportFormat error]", err);
      setError(err.message || "Failed to export chemicals.");
    } finally {
      setExporting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Add Chemical handlers
  // ---------------------------------------------------------------------------
  function handleAddChemical() {
    setShowAddModal(true);
  }

  /**
   * Called when the AddChemicalModal form is submitted.
   */
  async function handleAddChemicalSubmit(payload) {
    setSavingNew(true);
    setError(null);

    try {
      const created = await createChemical(payload);
      // Add new chemical at the top of the list
      setChemicals((prev) => [created, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      console.error("[createChemical error]", err);
      setError(
        "Failed to add chemical via API. Please check your backend or try again."
      );
    } finally {
      setSavingNew(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <SdsyncTopBar
        onLogout={onLogout}
        isAdmin={isAdmin}
        onSearchSubmit={(text) => {
          setSearchTerm(text);
          setCurrentPage(1); // reset pagination
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E3E8F0] to-[#C3CFE2]">
        {/* Page content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
          {/* Outer rounded card */}
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl border border-blue-200/60 shadow-2xl p-4 sm:p-6">
            {/* Filter bar + export menu */}
            <div className="relative">
              <FilterBar
                searchValue={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                nameFilter={nameFilter}
                onNameFilterChange={(value) => {
                  setNameFilter(value);
                  setCurrentPage(1);
                }}
                businessUnitFilter={businessUnitFilter}
                onBusinessUnitFilterChange={(value) => {
                  setBusinessUnitFilter(value);
                  setCurrentPage(1);
                }}
                supplierFilter={supplierFilter}
                onSupplierFilterChange={(value) => {
                  setSupplierFilter(value);
                  setCurrentPage(1);
                }}
                onExport={handleOpenExportMenu}
                onAddChemical={handleAddChemical}
                nameOptions={nameOptions}
                businessUnitOptions={businessUnitOptions}
                supplierOptions={supplierOptions}
              />

              {/* Export options dropdown */}
              {showExportMenu && (
                <div 
                  ref={exportMenuRef}
                  className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-20 text-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => handleExportFormat("csv")}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all font-medium text-gray-700 hover:text-green-700"
                    disabled={exporting}
                  >
                    📊 Export as CSV
                  </button>
                  <div className="h-px bg-gray-200"></div>
                  <button
                    type="button"
                    onClick={() => handleExportFormat("excel")}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all font-medium text-gray-700 hover:text-green-700"
                    disabled={exporting}
                  >
                    📈 Export as Excel
                  </button>
                  <div className="h-px bg-gray-200"></div>
                  <button
                    type="button"
                    onClick={() => handleExportFormat("pdf")}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all font-medium text-gray-700 hover:text-green-700"
                    disabled={exporting}
                  >
                    📄 Export as PDF
                  </button>
                </div>
              )}
            </div>

            {exporting && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold text-blue-800">
                    Preparing export for current page...
                  </span>
                </div>
              </div>
            )}
            {/* Table or loading spinner */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-semibold">Loading chemicals...</p>
              </div>
            ) : (
              <>
                <ChemicalTable
                  chemicals={pagedChemicals}
                  onViewChemical={handleViewChemical}
                  onEditChemical={handleEditChemical}
                />
                <PaginationControls
                  currentPage={currentPageSafe}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </section>
        </main>

        {/* Add-chemical modal */}
        <AddChemicalModal
          isOpen={showAddModal}
          onClose={() => !savingNew && setShowAddModal(false)}
          onSubmit={handleAddChemicalSubmit}
          loading={savingNew}
        />

        {/* Edit-chemical modal */}
        <EditChemicalModal
          isOpen={!!editingChemical}
          chemical={editingChemical}
          isAdmin={isAdmin}
          loading={savingEdit || deletingChemical}
          onClose={handleCloseEditModal}
          onDelete={handleDeleteCurrentChemical}
        />
      </div>
    </>
  );
}