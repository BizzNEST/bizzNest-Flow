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
import styles from "./MonthlyGrowthGraph.module.css";

const MonthlyGrowthChart = ({ internID }) => {
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);

  useEffect(() => {
    const fetchMonthlyGrowthData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/getMonthlyGrowth/${internID}`
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
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{`Month: ${label}`}</p>
          <p className={styles.tooltipValue}>
            Growth: <strong>{parseFloat(payload[0].value).toFixed(2)}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.monthlyGrowthContainer}>
      <h2>Monthly Growth Over Time</h2>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={monthlyGrowthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            angle={0}
            axisLine={{ stroke: "#ccc" }}
            tick={{ fontSize: 14, dy: 10, fill: "#ccc" }}
          />
          <YAxis
            axisLine={{ stroke: "#ccc" }}
            label={{
              value: "Growth %",
              angle: -90,
              dx: -25,
              paddingBottom: "10px",
              fill: "#ccc",
            }}
            tick={{ fontSize: 14, dy: 10, stroke: "#ccc" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "30px",
            }}
          />
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
