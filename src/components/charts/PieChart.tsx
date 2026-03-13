"use client";

import {
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PieChartProps {
  data: Record<string, unknown>[];
  nameKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
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

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: LabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#666"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChart({
  data,
  nameKey,
  valueKey,
  colors = PASTEL_COLORS,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showTooltip = true,
  showLegend = true,
  showLabels = true,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey={valueKey}
          nameKey={nameKey}
          paddingAngle={2}
          label={showLabels ? (renderCustomLabel as unknown as boolean) : false}
          labelLine={showLabels}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
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
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={10}
            formatter={(value: string) => (
              <span style={{ color: "#666", fontSize: 12 }}>{value}</span>
            )}
          />
        )}
      </RPieChart>
    </ResponsiveContainer>
  );
}
