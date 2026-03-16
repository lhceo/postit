import { SessionStatus } from "@/types";

const config: Record<SessionStatus, { label: string; classes: string; dot: string }> = {
  active: { label: "進行中", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400 animate-pulse" },
  paused: { label: "一時停止", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  ended: { label: "終了", classes: "bg-gray-500/10 text-gray-400 border-gray-500/20", dot: "bg-gray-500" },
};

export default function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
