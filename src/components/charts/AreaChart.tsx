"use client";

import {
  ResponsiveContainer,
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AreaChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string | string[];
  color?: string | string[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  gradientOpacity?: number;
  curved?: boolean;
  stacked?: boolean;
}

const PASTEL_COLORS = [
  "#A8D8EA",
  "#AA96DA",
  "#FCBAD3",
  "#B5EAD7",
  "#E2F0CB",
  "#C7CEEA",
  "#FFD6A5",
  "#CAFFBF",
  "#FFC6FF",
  "#FFFFD2",
];

export default function AreaChart({
  data,
  xKey,
  yKey,
  color,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  gradientOpacity = 0.3,
  curved = true,
  stacked = false,
}: AreaChartProps) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  const colors = Array.isArray(color)
    ? color
    : color
    ? [color]
    : PASTEL_COLORS;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          {yKeys.map((key, index) => (
            <linearGradient
              key={`gradient-${key}`}
              id={`gradient-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={colors[index % colors.length]}
                stopOpacity={gradientOpacity}
              />
              <stop
                offset="95%"
                stopColor={colors[index % colors.length]}
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
        </defs>
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
          <Area
            key={key}
            type={curved ? "monotone" : "linear"}
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            fill={`url(#gradient-${key})`}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
  );
}
