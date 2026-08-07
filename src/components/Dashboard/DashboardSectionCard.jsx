export default function DashboardSectionCard({
  title,
  children,
  searchPlaceholder,
  onSearchChange,
}) {
  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-3xl border border-blue-200/60 shadow-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <h3 className="text-lg font-bold text-[#003E77] tracking-tight">
          {title}
        </h3>

        {onSearchChange && (
          <div className="relative">
            <input
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white">
        {children}
      </div>
    </section>
  );
}
