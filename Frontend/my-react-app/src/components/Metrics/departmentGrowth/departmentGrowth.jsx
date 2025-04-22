import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import "./departmentGrowth.css";

// Maps department IDs to display names and gradient color pairs
const departmentMap = {
    0: { name: "Web Dev", color: ["rgb(0, 117, 37)", "#25FFC1"] }, // Green
    1: { name: "Design", color: ["rgb(206, 91, 42)", "rgb(251, 210, 45)"] }, // Orange
    2: { name: "Film", color: ["rgb(174, 40, 40)", "#EF2BD2"] }, // Red
};

/**
 * DepartmentGrowth Component
 * Fetches and displays percent growth by department in radial charts
 */
const DepartmentGrowth = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Fetch growth data per department from the backend
        const fetchDepartmentGrowth = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/departmentGrowth`);
                const data = await response.json();

                if (data?.departmentMetrics) {
                    // Format API data to include name and color for each department
                    const formattedData = data.departmentMetrics.map((dept) => ({
                        id: dept.departmentID,
                        name: departmentMap[dept.departmentID].name,
                        percentIncrease: parseFloat(dept.percent_increase.toFixed(2)),
                        color: departmentMap[dept.departmentID].color,
                    }));

                    setDepartments(formattedData);
                }
            } catch (error) {
                // Log fetch errors to console
                console.error("Error fetching department growth:", error);
            }
        };

        // Fetch once when component mounts
        fetchDepartmentGrowth();
    }, []);

    return (
        <div className="department-growth-container">
            <h3 className="chart-title">Growth by Department</h3>
            <div className="radial-charts">
                {/* Render one radial chart per department */}
                {departments.map(({ id, name, percentIncrease, color }) => (
                    <div key={id} className="radial-chart">
                        <ResponsiveContainer width={120} height={120}>
                            <RadialBarChart
                                innerRadius="75%"
                                outerRadius="100%"
                                data={[{ value: percentIncrease, fill: `url(#gradient${id})` }]}
                                startAngle={90}
                                endAngle={-180} // Defines circular progress arc direction
                            >
                                {/* Define gradient fill per department */}
                                <defs>
                                    <linearGradient id={`gradient${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={color[0]} />
                                        <stop offset="100%" stopColor={color[1]} />
                                    </linearGradient>
                                </defs>

                                {/* Radial progress bar */}
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: "#eee" }}
                                    clockWise
                                    dataKey="value"
                                    cornerRadius={10}
                                />

                                {/* Display percentage in center of the chart */}
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="growth-text">
                                    {percentIncrease}%
                                </text>
                            </RadialBarChart>
                        </ResponsiveContainer>

                        {/* Department name label under chart */}
                        <p className="department-label">{name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentGrowth;
