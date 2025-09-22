// components/UnitPieChart.jsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function UnitPieChart({ data }) {
  // Blue-to-purple palette
  const COLORS = [
    "#285197ff", // dark blue
    "#71aeddff", // light blue
    "#88e2f5ff", // cyan
    "#2d5b6cff", // teal-ish
    "#0000FF",   // pure blue
    "#ac90edff", // lavender
    "#8B00FF"    // violet
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend below pie chart in rectangular box */}
      <div className="mt-4 w-full bg-white shadow-lg rounded-lg p-4 flex flex-wrap justify-center gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm font-medium">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
