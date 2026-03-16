interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, sub, icon, accent = "bg-indigo-500/10 text-indigo-400" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start gap-4">
      <div className={`flex-shrink-0 rounded-xl p-3 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
