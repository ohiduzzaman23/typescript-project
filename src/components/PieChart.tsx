"use client";

import { PieChart } from "@mui/x-charts/PieChart";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface Props {
  expenses: Expense[];
}

export default function BasicPie({ expenses }: Props) {
  const categoryTotals = expenses.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    },
    {},
  );

  const colors: Record<string, string> = {
    Food: "#4361ee",
    Transport: "#fca311",
    Shopping: "#ef476f",
    Entertainment: "#00b4d8",
    Bills: "#2a9d8f",
    Others: "#6b7280",
  };

  const chartData = Object.entries(categoryTotals).map(
    ([category, total], index) => ({
      id: index,
      value: total,
      label: category,
      color: colors[category] || "#6b7280",
    }),
  );

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-full">
      <PieChart
        series={[
          {
            data: chartData,
          },
        ]}
        width={220}
        height={220}
        hideLegend
      />

      {/* Custom Legend */}
      <div className="w-full lg:w-auto space-y-3">
        {chartData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>

            <span className="font-semibold">US${item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
