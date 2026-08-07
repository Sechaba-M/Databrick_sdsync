import React from "react";

export default function BusinessSurvTable({ data }) {
  return (
    <div className="w-full mt-6">
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-[#003E77] to-[#004A92] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Business Unit
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Employee Count
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Monitoring Type
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Biomonitoring
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Surveillance Category
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Physical Examinations
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Biological Tests
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Frequency
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wide">
                  Regulatory Limits
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-6 py-5 font-bold text-gray-900 text-base">
                    {item.unit}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 
                                   rounded-full text-xs font-semibold border border-emerald-300 shadow-sm">
                      {item.employees} Employees
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.monitoring.split("\n").map((line, idx) => (
                      <div key={idx} className="leading-relaxed font-medium">{line}</div>
                    ))}
                  </td>

                  <td className="px-6 py-5 text-center text-gray-700 font-medium">
                    {item.biomonitoring}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                        item.category === "Legislative"
                          ? "bg-rose-100 text-rose-700 border border-rose-300"
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <ul className="space-y-1.5">
                      {item.exams.map((e, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-0.5">•</span>
                          <span className="text-gray-700 text-sm leading-relaxed">{e}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-6 py-5">
                    <ul className="space-y-1.5">
                      {item.tests.map((t, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-0.5">•</span>
                          <span className="text-gray-700 text-sm leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {item.frequency}
                  </td>

                  <td className="px-6 py-5 text-xs text-gray-600">
                    {item.limits.map((l, idx) => (
                      <div key={idx} className="mb-1.5 leading-relaxed">
                        {l}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-4 md:hidden">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg 
                     transition-shadow duration-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">{item.unit}</h3>
              <span className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 
                             rounded-full text-xs font-semibold border border-emerald-300 shadow-sm">
                {item.employees} Employees
              </span>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Monitoring Type
                </p>
                {item.monitoring.split("\n").map((line, idx) => (
                  <div key={idx} className="text-sm font-medium leading-relaxed">{line}</div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Biomonitoring
                </p>
                <p className="text-sm font-medium">{item.biomonitoring}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Surveillance Category
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                    item.category === "Legislative"
                      ? "bg-rose-100 text-rose-700 border border-rose-300"
                      : "bg-blue-100 text-blue-700 border border-blue-300"
                  }`}
                >
                  {item.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Physical Examinations
                </p>
                <ul className="space-y-1.5">
                  {item.exams.map((e, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-400 mr-2 mt-0.5">•</span>
                      <span className="text-sm">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                  Biological Tests
                </p>
                <ul className="space-y-1.5">
                  {item.tests.map((t, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-400 mr-2 mt-0.5">•</span>
                      <span className="text-sm">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                    Frequency
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {item.frequency}
                  </p>
                </div>
                <div className="text-xs text-gray-600 flex-1">
                  <p className="font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Regulatory Limits
                  </p>
                  {item.limits.map((l, idx) => (
                    <div key={idx} className="mb-1 leading-relaxed">{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}