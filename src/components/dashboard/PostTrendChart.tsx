"use client";

import { PostTimeSeries } from "@/types";

interface Props {
  data: PostTimeSeries[];
}

export default function PostTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
        データがありません
      </div>
    );
  }

  const width = 400;
  const height = 160;
  const padL = 32;
  const padR = 12;
  const padT = 12;
  const padB = 28;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const minCount = 0;

  const toX = (i: number) =>
    padL + (i / (data.length - 1)) * (width - padL - padR);
  const toY = (v: number) =>
    padT + ((maxCount - v) / (maxCount - minCount)) * (height - padT - padB);

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.count), ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = [
    ...points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${height - padB}`,
    `L ${points[0].x} ${height - padB}`,
    "Z",
  ].join(" ");

  // Y axis ticks
  const yTicks = [0, Math.round(maxCount / 2), maxCount];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={200} className="overflow-visible">
      {/* Grid lines */}
      {yTicks.map((tick) => (
        <line
          key={tick}
          x1={padL}
          x2={width - padR}
          y1={toY(tick)}
          y2={toY(tick)}
          stroke="#ffffff10"
          strokeWidth={1}
        />
      ))}

      {/* Y axis labels */}
      {yTicks.map((tick) => (
        <text
          key={tick}
          x={padL - 6}
          y={toY(tick) + 4}
          fontSize={10}
          fill="#6b7280"
          textAnchor="end"
        >
          {tick}
        </text>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="#6366F1" opacity={0.1} />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#6366F1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p) => (
        <circle key={p.time} cx={p.x} cy={p.y} r={3} fill="#6366F1" />
      ))}

      {/* X axis labels */}
      {points.map((p, i) => {
        // show every other label to avoid overlap
        if (data.length > 5 && i % 2 !== 0) return null;
        return (
          <text
            key={p.time}
            x={p.x}
            y={height - padB + 16}
            fontSize={10}
            fill="#6b7280"
            textAnchor="middle"
          >
            {p.time}
          </text>
        );
      })}
    </svg>
  );
}
