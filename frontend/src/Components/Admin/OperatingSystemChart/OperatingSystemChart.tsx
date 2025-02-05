import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, TooltipProps, ResponsiveContainer } from "recharts";

const COLORS = ["#94A5FF", "#5CDEFF", "#7280FF", "#8FD0EF" , "#3056D3"];

interface OsLoginCount {
  name: string;
  value: number;
}

interface OperatingSystemChartProps {
  totalOsCount: OsLoginCount[]; 
}

const OperatingSystemChart = ({ totalOsCount }: OperatingSystemChartProps) => {

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const bgColor = payload[0].payload.fill;
      return (
        <div
          className="rounded-sm p-3 shadow-xl text-black"
          style={{ backgroundColor: bgColor }} 
        >
          <p>{payload[0].name} : {payload[0].value} </p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={totalOsCount}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          innerRadius={70}
          fill="#8884d8"
          dataKey="value"
        >
          {totalOsCount.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OperatingSystemChart;
