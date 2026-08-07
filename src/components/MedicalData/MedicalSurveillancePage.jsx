import React, { useEffect, useState } from "react";
import {
  fetchChemicalSurveillance,
  fetchBusinessUnitSurveillance,
} from "../../api/medicalSurvApi";

import SurveillanceFilters from "./SurveillanceFilters";
import ChemicalSurvTable from "./ChemicalSurvTable";
import BusinessSurvTable from "./BusinessSurvTable";

import SdsyncTopBar from "../Navbar/NavBar";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

export default function MedicalSurveillancePage({ onLogout, isAdmin }) {
  const [tab, setTab] = useState("chemicals");
  const [chemData, setChemData] = useState([]);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(false);

  // FILTERS
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [monitorFilter, setMonitorFilter] = useState("all");

  // EXPORT
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ===== LOAD DATA (backend only) =====
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const chem = await fetchChemicalSurveillance();
        const bus = await fetchBusinessUnitSurveillance();
        setChemData(chem);
        setBusData(bus);
      } catch (err) {
        console.error("Failed to load surveillance data", err);
        setChemData([]);
        setBusData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ===== FILTER LOGIC =====
  const filteredChem = chemData.filter((item) => {
    const matchesSearch =
      item.chemical.toLowerCase().includes(search.toLowerCase()) ||
      item.cas.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || item.category === filter;
    const matchesMonitor =
      monitorFilter === "all" || item.monitoringType === monitorFilter;

    return matchesSearch && matchesFilter && matchesMonitor;
  });

  const filteredBusiness = busData.filter((item) => {
    const matchesSearch = item.unit
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "all" || item.category === filter;
    const matchesMonitor =
      monitorFilter === "all" || item.monitoring?.includes(monitorFilter);

    return matchesSearch && matchesFilter && matchesMonitor;
  });

  const currentData = tab === "chemicals" ? filteredChem : filteredBusiness;

  // ===== EXPORT HELPERS =====
  function toggleExportMenu() {
    setShowExportMenu((prev) => !prev);
  }

  function buildCSV(data) {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);

    const rows = data.map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          if (Array.isArray(val)) return `"${val.join(" | ")}"`;
          return `"${val ?? ""}"`;
        })
        .join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  }

  function downloadBlob(blob, filename) {
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  function handleExport(type) {
    setShowExportMenu(false);
    setExporting(true);

    if (!currentData.length) {
      alert("Nothing to export");
      setExporting(false);
      return;
    }

    const csv = buildCSV(currentData);
    const blob = new Blob([csv], {
      type:
        type === "excel"
          ? "application/vnd.ms-excel;charset=utf-8;"
          : "text/csv;charset=utf-8;",
    });

    downloadBlob(
      blob,
      `${tab}_surveillance.${type === "excel" ? "xlsx" : "csv"}`
    );

    setTimeout(() => setExporting(false), 500);
  }

  return (
    <>
      <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Tabs */}
          <div className="flex justify-center sm:justify-end mb-6">
            <div className="inline-flex rounded-xl shadow-sm border border-gray-200 bg-white p-1">
              <button
                className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === "chemicals"
                    ? "bg-gradient-to-r from-[#0B5794] to-[#0d6bb8] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setTab("chemicals")}
              >
                Chemicals
              </button>
              <button
                className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === "business"
                    ? "bg-gradient-to-r from-[#0B5794] to-[#0d6bb8] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setTab("business")}
              >
                Business Units
              </button>
            </div>
          </div>

          {/* Filters */}
          <SurveillanceFilters
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            secondary={monitorFilter}
            onSecondaryChange={setMonitorFilter}
          />

          {/* Export Section */}
          <div className="flex justify-end mt-6 mb-4 relative">
            <button
              onClick={toggleExportMenu}
              disabled={exporting}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 group-hover:animate-bounce" />
                  Export Data
                </>
              )}
            </button>

            {showExportMenu && (
              <div className="absolute mt-14 bg-white shadow-xl rounded-lg border border-gray-200 
                            w-48 text-sm right-0 z-20 overflow-hidden">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full px-4 py-3 hover:bg-blue-50 text-left flex items-center gap-3
                           transition-colors duration-150 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-700"> 📊 Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full px-4 py-3 hover:bg-blue-50 text-left flex items-center gap-3
                           transition-colors duration-150"
                >
                  <span className="font-medium text-gray-700">📈 Export as Excel</span>
                </button>
              </div>
            )}
          </div>

          {/* Data Display */}
          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B5794] mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading surveillance data...</p>
            </div>
          ) : tab === "chemicals" ? (
            filteredChem.length ? (
              <ChemicalSurvTable data={filteredChem} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No chemical surveillance data available.</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search criteria.</p>
              </div>
            )
          ) : filteredBusiness.length ? (
            <BusinessSurvTable data={filteredBusiness} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No business unit data available.</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}