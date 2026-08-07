import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Printer, ChevronDown, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import Pagination from "../pagination/Pagination";
function buildCSV(rows) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const csvRows = rows.map(r =>
    headers.map(h => `"${r[h]}"`).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function RiskAssessmentTable({ rows = [] }) {
  const [showExport, setShowExport] = useState(false);
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pagedRows = rows.slice(
  (page - 1) * PAGE_SIZE,
  page * PAGE_SIZE
  );

  function exportCSV() {
    const blob = new Blob([buildCSV(rows)], { type: "text/csv" });
    download(blob, "risk_assessments.csv");
    setShowExport(false);
  }

  function exportExcel() {
    const blob = new Blob([buildCSV(rows)], { type: "application/vnd.ms-excel" });
    download(blob, "risk_assessments.xlsx");
    setShowExport(false);
  }

  function exportPDF() {
    const win = window.open("", "_blank");

    const headers = Object.keys(rows[0] || {});
    const body = rows.map(r =>
      `<tr>${headers.map(h => `<td>${r[h]}</td>`).join("")}</tr>`
    ).join("");

    win.document.write(`
      <html><body>
      <table border="1">
        <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
        ${body}
      </table>
      <script>window.print()</script>
      </body></html>
    `);
    setShowExport(false);
  }

  const placeholderCell =
    "text-gray-400 italic border-l-4 border-amber-400 bg-amber-50/40";

  function cell(value, fallback) {
    return value ? value : (
      <span className={placeholderCell}>{fallback}</span>
    );
  }

  function getRiskIcon(risk) {
    if (risk === "High") return <AlertCircle size={14} />;
    if (risk === "Low") return <CheckCircle size={14} />;
    return <AlertTriangle size={14} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-[#003E77] flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Risk Assessment
          </h2>
          
          <div className="relative flex-shrink-0 w-full sm:w-auto">
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
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={exportPDF}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors"
                >
                  <Printer size={16} className="text-red-500" />
                  Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#003E77] to-[#0056A8] text-white">
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Assessment Title</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Date</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Assessor</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Chemicals Evaluated</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Risk Level</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Recommendations</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {pagedRows.length ? (
               pagedRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {cell(r.title, "Risk assessment")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(r.date, "Assessment date")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(r.assessor, "Assessor")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(r.chemicals, "Chemicals evaluated")}
                  </td>
                  <td className="px-6 py-4">
                    {r.risk ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        r.risk === "High"
                          ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                          : r.risk === "Low"
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                          : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                      }`}>
                        {getRiskIcon(r.risk)}
                        {r.risk}
                      </span>
                    ) : (
                      <span className={placeholderCell}>Risk level</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cell(r.recommendations, "Recommendations")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl opacity-20">⚠️</div>
                    <p className="text-gray-400 italic text-base">
                      Risk assessment data will appear here.
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