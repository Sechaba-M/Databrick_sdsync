import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchChemicals,
  updateChemical,
  deleteChemical,
} from "../../api/chemicalApi";
import FilterBar from "./FilterBar";
import ChemicalTable from "../AdminHome/ChemicalTable";
import PaginationControls from "../AdminHome/PaginationControls";
import SdsyncTopBar from "../Navbar/NavBar";
import EditChemicalModal from "../EditChemicalModal/EditChemicalModal";
import { AlertCircle } from "lucide-react";

/**
 * User Chemical Dashboard
 *  - Loads data from backend API
 *  - Holds state for search/filters
 *  - Handles pagination on the client side
 *  - Connects "View" / "Edit" / "Export" + EditChemicalModal
 */
export default function ChemicalPage({ onLogout, isAdmin }) {
  const navigate = useNavigate();

  // Raw list of chemicals from API
  const [chemicals, setChemicals] = useState([]);

  // Export Chemicals
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filters (search + dropdowns)
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // Pagination (client side)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // show 12 per page

  // Error state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [editingChemical, setEditingChemical] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingChemical, setDeletingChemical] = useState(false);

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

  // Derive filter options from chemicals
  const nameOptions = Array.from(
    new Set(chemicals.map((c) => c.name).filter(Boolean))
  );

  const supplierOptions = Array.from(
    new Set(chemicals.map((c) => c.supplier).filter(Boolean))
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

    const matchesSupplier =
      supplierFilter === "all" ||
      (chem.supplier || "").toLowerCase().includes(supplierFilter);

    return matchesSearch && matchesName && matchesSupplier;
  });

  // ---------------------------------------------------------------------------
  // Pagination logic
  // ---------------------------------------------------------------------------
  const totalPages = Math.max(
    1,
    Math.ceil(filteredChemicals.length / pageSize)
  );
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
    navigate(`/sds/${chemical.id}`);
  }

  function handleEditChemical(chemical) {
    setEditingChemical(chemical);
  }

  function handleCloseEditModal() {
    setEditingChemical(null);
    setSavingEdit(false);
    setDeletingChemical(false);
  }

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

  async function handleDeleteCurrentChemical(scope) {
    if (!editingChemical) return;

    try {
      setDeletingChemical(true);
      setError(null);

      await deleteChemical(editingChemical.id);

      setChemicals((prev) => prev.filter((c) => c.id !== editingChemical.id));

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
  // Export
  // ---------------------------------------------------------------------------
  function toggleExportMenu() {
    setShowExportMenu((prev) => !prev);
  }

  function buildCSV(list) {
    if (!list.length) return "";

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

    return [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const csv = buildCSV(pagedChemicals);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    download(blob, `chemicals_page-${currentPageSafe}.csv`);
  }

  function exportExcel() {
    const csv = buildCSV(pagedChemicals);
    const blob = new Blob([csv], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    download(blob, `chemicals_page-${currentPageSafe}.xlsx`);
  }

  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) return;

    const rows = pagedChemicals
      .map((c) => {
        return `
          <tr>
            <td>${c.id ?? ""}</td>
            <td>${c.name ?? ""}</td>
            <td>${c.casNumber ?? ""}</td>
            <td>${c.riskLevel ?? ""}</td>
            <td>${
              Array.isArray(c.hazards)
                ? c.hazards.join(" | ")
                : c.hazards ?? ""
            }</td>
            <td>${c.monitoringType ?? ""}</td>
            <td>${c.supplier ?? ""}</td>
          </tr>
        `;
      })
      .join("");

    win.document.write(`
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
              ${rows}
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

    win.document.close();
  }

  function handleExport(type) {
    setShowExportMenu(false);

    if (!pagedChemicals.length) {
      setError("No data to export for the current page.");
      return;
    }

    setExporting(true);

    try {
      if (type === "csv") exportCSV();
      if (type === "excel") exportExcel();
      if (type === "pdf") exportPDF();
    } catch (err) {
      console.error("[Export error]", err);
      setError("Failed to export data. Please try again.");
    } finally {
      setTimeout(() => setExporting(false), 600);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2]">
        {/* Page content */}
        <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          {/* Outer rounded card */}
          <section className="bg-white/60 rounded-2xl border border-blue-200 shadow-md p-3 sm:p-5">
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
                supplierFilter={supplierFilter}
                onSupplierFilterChange={(value) => {
                  setSupplierFilter(value);
                  setCurrentPage(1);
                }}
                onExport={toggleExportMenu}
                nameOptions={nameOptions}
                supplierOptions={supplierOptions}
              />

              {/* Export Options Dropdown */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 text-sm">
                  <button
                    type="button"
                    onClick={() => handleExport("csv")}
                    disabled={exporting}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Export as CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("excel")}
                    disabled={exporting}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Export as Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("pdf")}
                    disabled={exporting}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>

            {exporting && (
              <div className="mt-3 text-xs sm:text-sm text-blue-800">
                Preparing export for current page...
              </div>
            )}

            {/* Table or loading spinner */}
            {loading ? (
              <div className="py-10 text-center text-gray-500 text-sm">
                Loading chemicals...
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

        {/* Edit Chemical Modal */}
        <EditChemicalModal
          isOpen={!!editingChemical}
          chemical={editingChemical}
          isAdmin={isAdmin}
          loading={savingEdit || deletingChemical}
          onClose={handleCloseEditModal}
          onSaveMonitoringType={handleSaveMonitoringType}
          onDelete={handleDeleteCurrentChemical}
        />
      </div>
    </>
  );
}