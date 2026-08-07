export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end items-center gap-2 px-6 py-4 border-t border-gray-200">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 text-sm rounded border disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 text-sm rounded border disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
