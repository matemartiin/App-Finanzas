"use client";

import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string | string[];
  color?: string | string[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  barSize?: number;
  radius?: number;
}

const PASTEL_COLORS = [
  "#A8D8EA",
  "#AA96DA",
  "#FCBAD3",
  "#FFFFD2",
  "#B5EAD7",
  "#E2F0CB",
  "#C7CEEA",
  "#FFD6A5",
  "#CAFFBF",
  "#FFC6FF",
];

export default function BarChart({
  data,
  xKey,
  yKey,
  color,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  stacked = false,
  barSize,
  radius = 4,
}: BarChartProps) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  const colors = Array.isArray(color)
    ? color
    : color
    ? [color]
    : PASTEL_COLORS;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        )}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: "#888" }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#888" }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          tickFormatter={(value) =>
            typeof value === "number"
              ? value >= 1000
                ? `${(value / 1000).toFixed(1)}k`
                : String(value)
              : String(value)
          }
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [
              new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(Number(value)),
            ]}
          />
        )}
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            stackId={stacked ? "stack" : undefined}
            barSize={barSize}
            radius={[radius, radius, 0, 0]}
          />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}
