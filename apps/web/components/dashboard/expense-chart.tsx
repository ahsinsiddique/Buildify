"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { expenseChartData } from "@/lib/dashboard-data";

export function ExpenseChart() {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Analytics</p>
        <h3 className="mt-2 font-display text-3xl text-ink">Daily expenses</h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={expenseChartData}>
            <CartesianGrid stroke="#ddd6ce" strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#365847"
              strokeWidth={3}
              dot={{ r: 4, fill: "#bb6b3f" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
