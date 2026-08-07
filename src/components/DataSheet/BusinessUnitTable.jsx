import React from "react";

/**
 * BusinessUnitTable
 *
 * Props:
 *  - units: [{ unit: string, usage: string }]
 */
export default function BusinessUnitTable({ units = [] }) {
  if (!units.length) return null;

  return (
    <section className="bg-white rounded-xl p-5 mt-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Business Units
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-700">
            <th className="py-2 text-left">Unit</th>
            <th className="py-2 text-left">Usage</th>
          </tr>
        </thead>

        <tbody>
          {units.map((u, idx) => (
            <tr key={idx} className="border-b last:border-0">
              <td className="py-2">{u.unit}</td>
              <td className="py-2">{u.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}