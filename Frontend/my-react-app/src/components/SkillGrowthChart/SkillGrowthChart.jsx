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
                const response = await fetch(`http://localhost:3360/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    setGrowthData(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        growthPercentage: parseFloat(skill.growthPercentage.toFixed(2))
                    })));
                }
            } catch (error) {
                console.error("Error fetching growth data:", error);
            }
        };

        fetchGrowthData();
    }, [internID]);

    // ✅ Custom Tooltip to standardize text color
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-value">
                        {payload[0].payload.toolName}: <strong>{parseFloat(payload[0].value).toFixed(2)}%</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

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
                        barCategoryGap={20} 
                    >
                        <XAxis dataKey="toolName" angle={0} textAnchor="end" tick={{ fontSize: 14, dy: 10 }} />
                        <YAxis domain={[0, "auto"]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} /> {/* ✅ Use custom tooltip */}
                        <Legend />
                        <Bar dataKey="growthPercentage" fill="#8884d8" name="Growth %" barSize={50} fillOpacity={1}>
                            <LabelList dataKey="growthPercentage" position="top" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SkillGrowthChart;