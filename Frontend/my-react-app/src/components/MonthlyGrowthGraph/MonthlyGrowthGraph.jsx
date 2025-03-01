import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./MonthlyGrowthGraph.css";

const MonthlyGrowthChart = ({ internID }) => {
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);

  useEffect(() => {
    const fetchMonthlyGrowthData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3360/getMonthlyGrowth/${internID}`
        );
        const data = await response.json();

        if (data.success) {
          const sortedData = data.data
            .sort(
              (a, b) =>
                new Date(`${a.month} 1, ${a.year}`) -
                new Date(`${b.month} 1, ${b.year}`)
            )
            .map((entry) => ({
              ...entry,
              growthPercentage: parseFloat(entry.growthPercentage.toFixed(2)),
            }));
          setMonthlyGrowthData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching monthly growth:", error);
      }
    };

    fetchMonthlyGrowthData();
  }, [internID]);

  // ✅ Custom Tooltip for consistent style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Month: ${label}`}</p>
          <p className="tooltip-value">
            Growth: <strong>{parseFloat(payload[0].value).toFixed(2)}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="monthly-growth-container">
      <h2>Monthly Growth Over Time</h2>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={monthlyGrowthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <XAxis
            dataKey="month"
            angle={0}
            textAnchor="end"
            tick={{ fontSize: 14, dy: 10 }}
          />
          <YAxis
            label={{ value: "Growth %", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="growthPercentage"
            stroke="#00bcd4"
            name="Monthly Growth %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyGrowthChart;
