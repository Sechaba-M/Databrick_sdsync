import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { fetchChemicals } from "../../api/chemicalApi"; 

/**
 * AddChemicalModal
 *
 * Reusable modal for assigning a chemical to one or more business units,
 * with live autocomplete against backend.
 *
 * Business units are loaded from backend GET /api/business-units
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - onSubmit: function(payload)
 *  - loading: boolean
 */
export default function AddChemicalModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  // Text in the search input
  const [chemicalSearch, setChemicalSearch] = useState("");

  // Selected business units
  const [businessUnits, setBusinessUnits] = useState([]);

  // Options loaded from backend
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  const [buLoading, setBuLoading] = useState(false);
  const [buError, setBuError] = useState("");

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedChemical, setSelectedChemical] = useState(null);

  const [touched, setTouched] = useState(false);

  const containerRef = useRef(null);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setChemicalSearch("");
      setBusinessUnits([]);
      setSuggestions([]);
      setSearchLoading(false);
      setSearchError("");
      setSelectedChemical(null);
      setTouched(false);
      setBuError("");
    }
  }, [isOpen]);

  // Load business units from backend when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadBusinessUnits() {
      setBuLoading(true);
      setBuError("");

      try {
        const res = await fetch("/api/business-units");
        if (!res.ok) {
          throw new Error(`Failed to load business units (status ${res.status})`);
        }
        const data = await res.json();

        if (cancelled) return;

        // Data can be array of strings or array of objects
        let list = Array.isArray(data) ? data : data.items || [];

        if (!Array.isArray(list) || list.length === 0) {
          throw new Error("No business units available");
        }

        const names = list
          .map((item) =>
            typeof item === "string"
              ? item
              : item.name ||
                item.unitName ||
                item.label ||
                item.title ||
                null
          )
          .filter(Boolean);

        if (!names.length) {
          throw new Error("No valid business unit names found");
        }

        setBusinessUnitOptions(names);
      } catch (err) {
        console.error("[AddChemicalModal] business units error:", err);
        if (cancelled) return;

        setBusinessUnitOptions([]);
        setBuError(err.message || "Failed to load business units from server");
      } finally {
        if (!cancelled) setBuLoading(false);
      }
    }

    loadBusinessUnits();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Close when clicking outside card
  useEffect(() => {
    function handleClickOutside(e) {
      if (!isOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!loading) onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, loading, onClose]);

  // Toggle function for business unit "checkbox buttons"
  function toggleBusinessUnit(unit) {
    setBusinessUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  }

  // ---------------------------------------------------------------------------
  // Autocomplete: fetch suggestions as user types
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!chemicalSearch || chemicalSearch.trim().length < 2) {
      setSuggestions([]);
      setSearchError("");
      setSearchLoading(false);
      setSelectedChemical(null);
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");
      setSelectedChemical(null);

      try {
        const result = await fetchChemicals({
          search: chemicalSearch.trim(),
          pageSize: 5,
        });

        const items = Array.isArray(result) ? result : result.items || [];

        if (!isCancelled) {
          setSuggestions(items);
        }
      } catch (err) {
        console.error("[AddChemicalModal] autocomplete error", err);
        if (!isCancelled) {
          setSearchError("Could not load suggestions.");
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [chemicalSearch]);

  // When user clicks a suggestion, lock it in
  function handleSelectSuggestion(suggestion) {
    setSelectedChemical(suggestion);
    const label = suggestion.name || suggestion.chemicalName || "";
    setChemicalSearch(label);
    setSuggestions([]);
  }

  // ---------------------------------------------------------------------------
  // Form submission
  // ---------------------------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    if (!chemicalSearch.trim()) return;
    if (businessUnits.length === 0) return;

    const payload = {
      chemicalSearch: chemicalSearch.trim(),
      businessUnits,
      chemicalId: selectedChemical?.id ?? null,
      selectedChemical: selectedChemical ?? null,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
  }

  if (!isOpen) return null;

  const showChemicalError = touched && !chemicalSearch.trim();
  const showBUError = touched && businessUnits.length === 0;
  const canSubmit = !buLoading && businessUnitOptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 sm:px-0">
      <div
        ref={containerRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-[#003E77] text-white px-5 py-3">
          <h2 className="text-lg font-semibold">Add New Chemical</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Search for a chemical and assign it to one or more business units.
          </p>
        </div>

        <div className="h-0.5 bg-blue-200" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 text-sm">
          {/* Chemical Search */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-1">
              Chemical Search <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={chemicalSearch}
                onChange={(e) => setChemicalSearch(e.target.value)}
                placeholder="Search by name, formula, or CAS number..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Autocomplete suggestions */}
            {chemicalSearch.trim().length >= 2 && (
              <div className="mt-1 relative">
                {searchLoading && (
                  <p className="text-xs text-gray-500">Searching…</p>
                )}
                {searchError && (
                  <p className="text-xs text-red-600">{searchError}</p>
                )}
                {!searchLoading && !searchError && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto">
                    {suggestions.map((chem) => (
                      <li
                        key={chem.id || chem.casNumber || chem.name}
                        className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSelectSuggestion(chem)}
                      >
                        <p className="font-semibold text-gray-800">
                          {chem.name ||
                            chem.chemicalName ||
                            "Unnamed chemical"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {chem.casNumber && <>CAS: {chem.casNumber}</>}
                          {chem.formula && (
                            <>
                              {" "}
                              • <span>Formula: {chem.formula}</span>
                            </>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {!searchLoading &&
                  !searchError &&
                  suggestions.length === 0 &&
                  chemicalSearch.trim().length >= 2 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      No matches found. You can still add using this name.
                    </p>
                  )}
              </div>
            )}

            {showChemicalError && (
              <p className="mt-1 text-xs text-red-600">
                Please enter or select a chemical.
              </p>
            )}
          </div>

          {/* Business Units */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800 mb-2">
              Business Units <span className="text-red-500">*</span>
            </label>

            {buLoading && (
              <p className="text-xs text-gray-500 mb-2">
                Loading business units…
              </p>
            )}
            
            {buError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">{buError}</p>
              </div>
            )}

            {!buLoading && businessUnitOptions.length === 0 && !buError && (
              <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                  No business units available. Please contact your administrator.
                </p>
              </div>
            )}

            {businessUnitOptions.length > 0 && (
              <div className="space-y-2">
                {businessUnitOptions.map((unit) => {
                  const selected = businessUnits.includes(unit);
                  return (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => toggleBusinessUnit(unit)}
                      className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors
                        ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded border text-xs
                          ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-400 bg-white"
                          }`}
                      >
                        {selected ? "✓" : ""}
                      </span>
                      <span className="text-gray-800">{unit}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {showBUError && (
              <p className="mt-1 text-xs text-red-600">
                Please select at least one business unit.
              </p>
            )}
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-lg bg-gray-400 text-white font-medium py-2 text-sm hover:bg-gray-500 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full rounded-lg bg-gradient-to-r from-[#0059B3] to-[#003E77] text-white font-semibold py-2 text-sm hover:from-[#0066cc] hover:to-[#004488] disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Chemical"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

