import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import "./SkillGrowthChart.css"; 

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

const SkillGrowthChart = ({ internID }) => {
    const [growthData, setGrowthData] = useState([]);

    useEffect(() => {
        const fetchGrowthData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    setGrowthData(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        growthPercentage: parseFloat(skill.growthPercentage)
                    })));
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
            {growthData.length === 0 ? (
                <p>No growth data available.</p>
            ) : (
                <ResponsiveContainer width="100%" height={450}>
                    <BarChart 
                        data={growthData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        barCategoryGap={20} /* ✅ Adds spacing between bars */
                    >
                        {/* ✅ Brighter Purple Gradient for Bars */}
                        <defs>
                            <linearGradient id="barGradient" x1="0" x2="0" y1="1" y2="0">
                                <stop offset="0%" stopColor="#c333fd" />  {/* Vibrant Purple */}
                                <stop offset="100%" stopColor="#7b1fa2" /> {/* Lighter Purple */}
                            </linearGradient>
                        </defs>

                        <XAxis 
                            dataKey="toolName" 
                            angle={0} 
                            textAnchor="end" 
                            tick={{ fontSize: 14, dy: 10 }} 
                        />
                        <YAxis domain={[0, "auto"]} />
                        <Tooltip cursor={{ fill: "transparent" }} /> {/* ✅ Removes bar hover effect */}
                        <Legend />
                        <Bar 
                            dataKey="growthPercentage" 
                            fill="url(#barGradient)" 
                            name="Growth %" 
                            barSize={50} 
                            fillOpacity={1} /* ✅ Ensures bars do not change color on hover */
                        >
                            <LabelList dataKey="growthPercentage" position="top" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SkillGrowthChart;