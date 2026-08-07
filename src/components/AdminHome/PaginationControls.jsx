import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Simple pagination control bar.
 * Parent passes currentPage and totalPages and callbacks to change page.
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  // helper to generate something like: 1 2 3 ... 99
  function getPages() {
    const pages = [];
    const maxButtons = 5; // only show a handful of numbers

    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    // Show first, current-1, current, current+1, last
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  }

  const pageItems = getPages();

  return (
    <div className="flex items-center justify-center gap-2.5 py-8 text-sm">
      {/* Previous button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-300 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm hover:shadow-md"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page numbers */}
      {pageItems.map((p, idx) =>
        p === "..." ? (
          <span 
            key={`ellipsis-${idx}`} 
            className="px-3 text-gray-400 font-semibold select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[2.5rem] h-10 px-4 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm hover:shadow-md ${
              p === currentPage
                ? "bg-gradient-to-br from-[#003E77] to-[#004A92] text-white scale-110 shadow-lg"
                : "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:scale-105"
            }`}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-300 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm hover:shadow-md"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}