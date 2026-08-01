export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800" />
          <div className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800" />
          <div className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800" />
        </div>
      </div>
    </div>
  );
}
