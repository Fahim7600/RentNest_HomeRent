export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-slate-900" />
        <div className="mb-8 space-y-2">
          <div className="h-8 w-80 animate-pulse rounded-lg bg-slate-900" />
          <div className="h-4 w-48 animate-pulse rounded bg-slate-900/60" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-slate-900" />
          </div>
          <div>
            <div className="h-72 w-full animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
