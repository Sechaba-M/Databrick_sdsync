import React from "react";
import { Flame, Eye, Skull } from "lucide-react";

export default function ChemicalRow({ chemical, index, onView, onEdit }) {
  const rowBg = index % 2 === 0 ? "bg-white" : "bg-blue-50/30";

  const hasDynamicIcons =
    Array.isArray(chemical.icons) && chemical.icons.length > 0;

  const missingStyle =
    "border-l-4 border-amber-400 bg-gradient-to-r from-amber-50/60 to-transparent";

  const renderIconFromKey = (iconKey, idx) => {
    const key = String(iconKey).toLowerCase();

    if (key.includes("flame")) return <Flame key={idx} className="w-5 h-5 text-red-500 drop-shadow-sm" />;
    if (key.includes("eye")) return <Eye key={idx} className="w-5 h-5 text-gray-700 drop-shadow-sm" />;
    if (key.includes("skull") || key.includes("toxic"))
      return <Skull key={idx} className="w-5 h-5 text-purple-700 drop-shadow-sm" />;

    return <Skull key={idx} className="w-5 h-5 text-gray-500 drop-shadow-sm" />;
  };

  return (
    <tr className={`${rowBg} hover:bg-blue-50/50 transition-colors group`}>
      {/* Name */}
      <td
        className={`px-4 py-4 text-sm font-semibold cursor-pointer transition-all ${
          chemical.name 
            ? "text-blue-700 hover:text-blue-900 group-hover:underline" 
            : missingStyle
        }`}
        onClick={() => onView && onView(chemical)}
      >
        {chemical.name || "—"}
      </td>

      {/* CAS Number */}
      <td
        className={`px-4 py-4 text-sm font-mono whitespace-nowrap ${
          chemical.casNumber ? "text-gray-700" : missingStyle
        }`}
      >
        {chemical.casNumber || "—"}
      </td>

      {/* Risk Level */}
      <td
        className={`px-4 py-4 whitespace-nowrap ${
          chemical.riskLevel ? "" : missingStyle
        }`}
      >
        {chemical.riskLevel ? (
          <span className="inline-flex px-3.5 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm">
            {chemical.riskLevel}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Safety Icons */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          {hasDynamicIcons
            ? chemical.icons.map(renderIconFromKey)
            : (
              <>
                <div className="p-1.5 rounded-lg bg-red-50 border border-red-200">
                  <Flame className="w-4 h-4 text-red-500" />
                </div>
                <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-200">
                  <Eye className="w-4 h-4 text-gray-700" />
                </div>
                <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200">
                  <Skull className="w-4 h-4 text-purple-700" />
                </div>
              </>
            )}
        </div>
      </td>

      {/* Hazards */}
      <td
        className={`px-4 py-4 text-sm whitespace-nowrap ${
          chemical.hazards ? "text-gray-700" : missingStyle
        }`}
      >
        {Array.isArray(chemical.hazards)
          ? chemical.hazards.join(" | ")
          : chemical.hazards || "—"}
      </td>

      {/* Monitoring Type */}
      <td
        className={`px-4 py-4 whitespace-nowrap ${
          chemical.monitoringType ? "" : missingStyle
        }`}
      >
        {chemical.monitoringType ? (
          <span className="inline-flex px-3.5 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-300 shadow-sm">
            {chemical.monitoringType}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Supplier */}
      <td
        className={`px-4 py-4 text-sm whitespace-nowrap ${
          chemical.supplier ? "text-gray-700 font-medium" : missingStyle
        }`}
      >
        {chemical.supplier || "—"}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex gap-2.5">
          <button
            onClick={() => onView && onView(chemical)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#003E77] to-[#004A92] text-white hover:from-[#1F4E79] hover:to-[#2A5A8F] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            View
          </button>
          <button
            onClick={() => onEdit && onEdit(chemical)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}