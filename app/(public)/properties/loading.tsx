export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-10 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-900" />
          <div className="h-4 w-96 animate-pulse rounded bg-slate-900/60" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-6" />
          </div>

          {/* Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
                >
                  <div className="aspect-[16/10] w-full bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-slate-800" />
                    <div className="h-4 w-1/2 rounded bg-slate-800/60" />
                    <div className="h-10 w-full rounded bg-slate-800/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
