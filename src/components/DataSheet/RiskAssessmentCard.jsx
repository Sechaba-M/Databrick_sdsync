import React from "react";
import { Pencil } from "lucide-react";

/**
 * RiskAssessmentCard
 *
 * Props:
 *  - data: {
 *      exposureRoutes: string,
 *      healthEffects: { acute: string, chronic: string },
 *      controlMeasures: string[],
 *      riskRating: string
 *    }
 *  - onEdit: function called when Edit button is clicked
 */
export default function RiskAssessmentCard({ data, onEdit }) {
  if (!data) return null;

  return (
    <section className="bg-orange-50 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Risk Assessment</h2>

        {/* Edit button – parent can open a modal / route */}
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 flex items-center gap-1"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
      </div>

      <div className="text-sm text-gray-800 grid sm:grid-cols-2 gap-4">
        {/* Left column */}
        <div>
          <p className="font-semibold text-gray-700 mb-1">Exposure Routes:</p>
          <p>{data.exposureRoutes}</p>

          <p className="font-semibold text-gray-700 mt-4 mb-1">Health Effects:</p>
          <p>
            <strong>Acute:</strong> {data.healthEffects?.acute}
          </p>
          <p>
            <strong>Chronic:</strong> {data.healthEffects?.chronic}
          </p>

          <p className="font-semibold text-gray-700 mt-4 mb-1">
            Control Measures:
          </p>
          <ul className="list-disc list-inside">
            {data.controlMeasures?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div>
          <p className="font-semibold text-gray-700 mb-1">Risk Rating:</p>
          <p>
            <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              {data.riskRating}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}