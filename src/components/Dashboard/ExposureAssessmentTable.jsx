import React, { useMemo, useState } from "react";
import { Search, Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import Pagination from "../pagination/Pagination";

function buildCSV(rows) {
  const headers = Object.keys(rows[0]);
  const csvRows = rows.map((row) =>
    headers
      .map((h) => {
        const v = row[h];
        if (v == null) return '""';
        return `"${String(v).replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExposureAssessmentDetails({ rows = [] }) {
  const [search, setSearch] = useState("");
  const [showExport, setShowExport] = useState(false);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    const q = search.toLowerCase();
    return rows.filter((r) =>
      [
        r.chemical,
        r.method,
        r.results,
        r.assessor,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [rows, search]);
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pagedRows = filteredRows.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
  );


  function exportCSV() {
    const blob = new Blob([buildCSV(filteredRows)], {
      type: "text/csv;charset=utf-8;",
    });
    download(blob, "exposure_assessments.csv");
    setShowExport(false);
  }

  function exportExcel() {
    const blob = new Blob([buildCSV(filteredRows)], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    download(blob, "exposure_assessments.xlsx");
    setShowExport(false);
  }

  const placeholderCell =
    "text-gray-400 italic border-l-4 border-amber-400 bg-amber-50/40";

  function cell(value, fallback) {
    return value ? value : (
      <span className={placeholderCell}>{fallback}</span>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-[#003E77] flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            Exposure Assessment Details
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chemical, method, assessor..."
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#003E77] focus:border-transparent transition-all"
              />
            </div>

            {/* Export */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowExport((v) => !v)}
                className="bg-green-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <Download size={16} />
                Export
                <ChevronDown size={16} className={`transition-transform duration-200 ${showExport ? 'rotate-180' : ''}`} />
              </button>

              {showExport && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                  <button
                    onClick={exportCSV}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <FileText size={16} className="text-emerald-500" />
                    Export CSV
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={exportExcel}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <FileSpreadsheet size={16} className="text-blue-500" />
                    Export Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#003E77] to-[#0056A8] text-white">
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Chemical</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Method</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Duration</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Results</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Assessor</th>
              <th className="px-6 py-4 text-center font-semibold tracking-wide">
                Employees Monitored
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredRows.length ? (
              pagedRows.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {cell(row.chemical, "Chemical")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(row.method, "Assessment method")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(row.duration, "Duration")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {cell(row.results, "Assessment result")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(row.assessor, "Assessor")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center font-bold text-[#003E77] bg-blue-100 px-3 py-1 rounded-full text-sm">
                      {cell(row.employees, "—")}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl opacity-20">🔬</div>
                    <p className="text-gray-400 italic text-base">
                      {search.trim() ? "No matching assessments found." : "Exposure assessment data will appear here."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}