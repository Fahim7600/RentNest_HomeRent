export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Skeleton */}
        <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse p-8 flex flex-col justify-center space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-10 w-3/4 max-w-lg bg-slate-800 rounded" />
          <div className="h-4 w-1/2 max-w-sm bg-slate-800/60 rounded" />
        </div>

        {/* Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
