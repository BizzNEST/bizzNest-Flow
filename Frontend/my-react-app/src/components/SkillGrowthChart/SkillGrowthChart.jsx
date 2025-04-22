import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";
import "./SkillGrowthChart.css";

// Maps tool IDs to human-readable skill names
const toolMap = {
  0: "Frontend",
  1: "Backend",
  2: "WordPress",
  3: "Photoshop",
  4: "Illustrator",
  5: "Figma",
  6: "Premiere Pro",
  7: "Camera Work"
};

/**
 * SkillGrowthChart Component
 * Displays a bar chart representing skill growth percentages for a specific intern.
 * 
 * @param {Object} props
 * @param {string} props.internID - Unique ID of the intern whose growth is being visualized
 */
const SkillGrowthChart = ({ internID }) => {
  const [growthData, setGrowthData] = useState([]);

  // Fetch growth data on mount or when internID changes
  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
        const data = await response.json();

        if (data.success) {
          // Format skill data with readable names and parsed percentages
          setGrowthData(
            data.data.map((skill) => ({
              toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
              growthPercentage: parseFloat(skill.growthPercentage)
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching growth data:", error);
      }
    };

    fetchGrowthData();
  }, [internID]);

  return (
    <div className="skill-growth-container">
      <h2>Skill Growth</h2>

      {/* Show message if no data */}
      {growthData.length === 0 ? (
        <p>No growth data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={growthData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            barCategoryGap={20} // Adds spacing between bars
          >
            {/* Gradient fill for bars */}
            <defs>
              <linearGradient id="barGradient" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />  {/* Bottom (Vibrant Pink-Purple) */}
                <stop offset="100%" stopColor="#a655f1" /> {/* Top (Light Purple) */}
              </linearGradient>
            </defs>

            {/* X-axis: Tool Names */}
            <XAxis
              dataKey="toolName"
              angle={0}
              textAnchor="end"
              tick={{ fontSize: 14, dy: 10 }}
            />

            {/* Y-axis: Growth % values */}
            <YAxis domain={[0, "auto"]} />

            {/* Tooltip on hover */}
            <Tooltip cursor={{ fill: "transparent" }} />

            {/* Legend under chart */}
            <Legend />

            {/* Bar element: renders growth bars */}
            <Bar
              dataKey="growthPercentage"
              fill="url(#barGradient)"
              name="Growth %"
              barSize={50}
              fillOpacity={1} // Prevents bar color shift on hover
            >
              {/* Labels above bars */}
              <LabelList dataKey="growthPercentage" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SkillGrowthChart;
