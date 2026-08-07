import React from "react";

/**
 * SDSection
 * Generic card-like section for the SDS.
 *
 * Props:
 *  - title: string (section heading)
 *
 *  - children: section content
 */
export default function SDSection({ title, bg = "bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2]", children }) {
  return (
    <section className={`${bg} rounded-xl p-5 mt-6`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </section>
  );
}