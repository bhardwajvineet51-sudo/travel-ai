import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { BudgetBreakdown } from "../types";

const COLORS = ["#1c86f2", "#ff7b47", "#22c55e", "#a855f7", "#eab308", "#64748b"];

export default function BudgetChart({ budget, currency }: { budget: BudgetBreakdown; currency: string }) {
  const data = [
    { name: "Transport", value: budget.transport },
    { name: "Hotel", value: budget.hotel },
    { name: "Food", value: budget.food },
    { name: "Activities", value: budget.activities },
    { name: "Local Transport", value: budget.localTransport },
    { name: "Miscellaneous", value: budget.miscellaneous },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${currency} ${Number(v).toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
