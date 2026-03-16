"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PostTimeSeries } from "@/types";

interface Props {
  data: PostTimeSeries[];
}

export default function PostTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#f9fafb", fontSize: 12 }}
          labelStyle={{ color: "#9ca3af" }}
          cursor={{ stroke: "#6366F1", strokeWidth: 1 }}
        />
        <Line type="monotone" dataKey="count" name="投稿数" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#6366F1" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
