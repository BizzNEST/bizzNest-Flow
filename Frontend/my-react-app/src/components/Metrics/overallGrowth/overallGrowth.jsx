import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import "./overallGrowth.css";

/**
 * OverallGrowth Component
 * Fetches and displays overall skill growth as a radial chart.
 */
const OverallGrowth = () => {
    const [growthPercentage, setGrowthPercentage] = useState(0);

    useEffect(() => {
        // Fetch overall growth percentage from the backend
        const fetchOverallGrowth = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/overallGrowth`);
                const data = await response.json();

                // If data exists, round to one decimal place and update state
                if (data?.overallSkills?.percent_increase !== undefined) {
                    setGrowthPercentage(parseFloat(data.overallSkills.percent_increase.toFixed(1)));
                }
            } catch (error) {
                // Log any fetch errors
                console.error("Error fetching overall growth:", error);
            }
        };

        // Fetch on component mount
        fetchOverallGrowth();
    }, []);

    // Chart data format for Recharts
    const data = [{ name: "Growth", value: growthPercentage, fill: "url(#colorGradient)" }];

    return (
        <div className="overall-growth-container">
            <h3 className="chart-title">Overall Growth</h3>

            {/* Responsive container to scale the chart */}
            <ResponsiveContainer width="100%" height={170}>
                <RadialBarChart
                    innerRadius="80%"
                    outerRadius="100%"
                    data={data}
                    startAngle={90}
                    endAngle={-180} // Renders progress from top center counterclockwise
                    clockWise={false}
                >
                    {/* Define gradient for smooth bar coloring */}
                    <defs>
                        <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c333fd" />
                            <stop offset="100%" stopColor="#ef2bd2" />
                        </linearGradient>
                    </defs>

                    {/* Radial bar to visualize the growth value */}
                    <RadialBar
                        minAngle={15}
                        background={{ fill: "#eee" }}
                        clockWise
                        dataKey="value"
                        cornerRadius={10} 
                        animationBegin={0}
                        animationDuration={1200} 
                    />

                    {/* Display growth percentage in center of chart */}
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="growth-text">
                        {growthPercentage}%
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OverallGrowth;
