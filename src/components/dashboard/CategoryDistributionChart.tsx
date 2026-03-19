"use client";

import { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryDistributionChart({ categories }: Props) {
  const total = categories.reduce((sum, c) => sum + c.postCount, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
        まだ投稿がありません
      </div>
    );
  }

  // Build donut segments
  const cx = 100;
  const cy = 100;
  const r = 70;
  const ir = 50;
  const gap = 0.02; // radians gap between segments

  let currentAngle = -Math.PI / 2;

  const segments = categories
    .filter((c) => c.postCount > 0)
    .map((cat) => {
      const angle = (cat.postCount / total) * (2 * Math.PI) - gap;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle += angle + gap;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const ix1 = cx + ir * Math.cos(endAngle);
      const iy1 = cy + ir * Math.sin(endAngle);
      const ix2 = cx + ir * Math.cos(startAngle);
      const iy2 = cy + ir * Math.sin(startAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      const d = [
        `M ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${ir} ${ir} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        "Z",
      ].join(" ");

      return { ...cat, d };
    });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 200 200" width={120} height={120} className="flex-shrink-0">
        {segments.map((seg) => (
          <path key={seg.id} d={seg.d} fill={seg.color} opacity={0.9} />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5 text-xs min-w-0">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-gray-400 truncate">{cat.name}</span>
            <span className="text-gray-600 ml-auto pl-2">{cat.postCount}件</span>
          </div>
        ))}
      </div>
    </div>
  );
}
