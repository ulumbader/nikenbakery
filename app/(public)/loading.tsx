export default function PublicLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="w-32 h-6 bg-butter/50 border-2 border-ink rounded-full" />
        <div className="w-3/4 max-w-md h-10 bg-ink/10 border-2 border-ink rounded-[10px]" />
        <div className="w-1/2 max-w-sm h-4 bg-ink/10 rounded" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border-3 border-ink rounded-[14px] shadow-[var(--shadow-brutal)] overflow-hidden flex flex-col h-80"
          >
            <div className="w-full h-44 bg-cream border-b-3 border-ink flex items-center justify-center text-3xl opacity-40">
              🎂
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-20 h-4 bg-pink/30 border border-ink rounded" />
                <div className="w-40 h-5 bg-ink/15 rounded" />
              </div>
              <div className="w-full h-10 bg-butter/40 border-2 border-ink rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
