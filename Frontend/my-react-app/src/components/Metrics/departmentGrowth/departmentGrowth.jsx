import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import "./departmentGrowth.css";

const departmentMap = {
    0: { name: "Web Dev", color: ["#28a745", "#6bcf80"] }, // Green
    1: { name: "Design", color: ["#FFA500", "#FFC04D"] }, // Orange
    2: { name: "Film", color: ["#DC143C", "#FF6F61"] }, // Red
};

const DepartmentGrowth = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartmentGrowth = async () => {
            try {
                const response = await fetch("http://localhost:3360/departmentGrowth");
                const data = await response.json();

                if (data?.departmentMetrics) {
                    const formattedData = data.departmentMetrics.map((dept) => ({
                        id: dept.departmentID,
                        name: departmentMap[dept.departmentID].name,
                        percentIncrease: parseFloat(dept.percent_increase.toFixed(2)),
                        color: departmentMap[dept.departmentID].color,
                    }));

                    setDepartments(formattedData);
                }
            } catch (error) {
                console.error("Error fetching department growth:", error);
            }
        };

        fetchDepartmentGrowth();
    }, []);

    return (
        <div className="department-growth-container">
            <h3 className="chart-title">Growth by Department</h3>
            <div className="radial-charts">
                {departments.map(({ id, name, percentIncrease, color }) => (
                    <div key={id} className="radial-chart">
                        <ResponsiveContainer width={120} height={120}>
                            <RadialBarChart
                                innerRadius="75%"
                                outerRadius="100%"
                                data={[{ value: percentIncrease, fill: `url(#gradient${id})` }]}
                                startAngle={90}
                                endAngle={-180} // Maps 0-100% → 90° to -180°
                            >
                                <defs>
                                    <linearGradient id={`gradient${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={color[0]} />
                                        <stop offset="100%" stopColor={color[1]} />
                                    </linearGradient>
                                </defs>
                                <RadialBar
                                    minAngle={15}
                                    background={{ fill: "#eee" }}
                                    clockWise
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="growth-text">
                                    {percentIncrease}%
                                </text>
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <p className="department-label">{name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentGrowth;