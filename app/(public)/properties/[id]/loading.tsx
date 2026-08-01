export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Header */}
        <div className="h-6 w-32 bg-slate-800 rounded" />

        {/* Gallery */}
        <div className="h-96 w-full bg-slate-900/60 border border-slate-800 rounded-3xl" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 w-3/4 bg-slate-800 rounded" />
            <div className="h-24 w-full bg-slate-900/60 border border-slate-800 rounded-2xl" />
            <div className="h-40 w-full bg-slate-900/60 border border-slate-800 rounded-2xl" />
          </div>
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4" />
        </div>
      </div>
    </div>
  );
}
