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

/**
 * MonthlyGrowthChart Component
 * Displays a line chart of monthly growth percentages for a specific intern.
 * 
 * @param {Object} props
 * @param {string} props.internID - Unique identifier of the intern
 */
const MonthlyGrowthChart = ({ internID }) => {
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);

  useEffect(() => {
    // Fetch monthly growth data for the specified intern
    const fetchMonthlyGrowthData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getMonthlyGrowth/${internID}`
        );
        const data = await response.json();

        if (data.success) {
          // Sort data chronologically and format growth percentage
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
        // Handle fetch error
        console.error("Error fetching monthly growth:", error);
      }
    };

    // Trigger data fetch when component mounts or internID changes
    fetchMonthlyGrowthData();
  }, [internID]);

  /**
   * CustomTooltip
   * Renders a styled tooltip for the chart on hover
   */
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

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={monthlyGrowthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          {/* X-axis showing month names */}
          <XAxis
            dataKey="month"
            angle={0}
            textAnchor="end"
            tick={{ fontSize: 14, dy: 10 }}
          />

          {/* Y-axis with label for Growth % */}
          <YAxis
            label={{ value: "Growth %", angle: -90, position: "insideLeft" }}
          />

          {/* Tooltip with custom content */}
          <Tooltip content={<CustomTooltip />} />

          {/* Legend for line */}
          <Legend />

          {/* Line showing growth percentage over time */}
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
