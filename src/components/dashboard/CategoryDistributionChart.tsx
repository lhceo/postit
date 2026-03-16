"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryDistributionChart({ categories }: Props) {
  const data = categories.map((c) => ({ name: c.name, value: c.postCount, color: c.color }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#f9fafb", fontSize: 12 }}
          formatter={(value, name) => [`${value}件`, name]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
