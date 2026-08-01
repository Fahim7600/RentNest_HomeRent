export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Skeleton */}
          <div className="w-full md:w-64 h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6 space-y-4 shrink-0">
            <div className="h-6 w-32 bg-slate-800 rounded" />
            <div className="h-10 w-full bg-slate-800/60 rounded" />
            <div className="h-10 w-full bg-slate-800/60 rounded" />
            <div className="h-10 w-full bg-slate-800/60 rounded" />
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4"
              >
                <div className="h-44 w-full bg-slate-800 rounded-xl" />
                <div className="h-5 w-3/4 bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
