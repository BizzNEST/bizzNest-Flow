import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './monthlyGrowth.css';

/**
 * ProgramMonthlyGrowth Component
 * Fetches monthly growth data and visualizes it using a Line Chart from Recharts.
 */
const ProgramMonthlyGrowth = () => {
    const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);

    useEffect(() => {
        // Fetch monthly growth metrics from the backend
        const fetchMonthlyGrowthData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/monthlyGrowth`);
                const data = await response.json();

                if (data?.monthlyMetrics) {
                    // Sort data chronologically and format it for the chart
                    const sortedData = data.monthlyMetrics.sort((a, b) => 
                        new Date(a.month) - new Date(b.month)
                    ).map(entry => ({
                        formattedMonth: new Date(entry.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
                        percentGrowth: parseFloat(entry.percentGrowth.toFixed(2))
                    }));

                    setMonthlyGrowthData(sortedData);
                }
            } catch (error) {
                // Log any errors encountered during fetch
                console.error("Error fetching monthly growth:", error);
            }
        };

        // Call fetch function when component mounts
        fetchMonthlyGrowthData();
    }, []);

    /**
     * Custom tooltip for Recharts
     * @param {object} props - Contains tooltip data and formatting
     * @returns {JSX.Element|null}
     */
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{`Month: ${label}`}</p>
                    <p className="tooltip-value">
                        📊 Percentage Growth: <strong>{payload[0].value}%</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="program-monthly-growth-container">
            <h3 className="chart-title">Monthly Growth</h3>
            <ResponsiveContainer width={600} height={170}>
                <LineChart 
                    data={monthlyGrowthData} 
                    margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
                >
                    {/* X-axis displays month names */}
                    <XAxis 
                        dataKey="formattedMonth"
                        angle={-30} 
                        textAnchor="end" 
                        tick={{ fontSize: 10 }} 
                        height={40}
                    />

                    {/* Y-axis displays percentage growth */}
                    <YAxis 
                        label={{ value: "Growth (%)", angle: -90, position: "insideLeft", fontSize: 10 }} 
                        domain={['auto', 'auto']}
                    />

                    {/* Custom tooltip component */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* Chart legend */}
                    <Legend />

                    {/* Line representing monthly growth */}
                    <Line 
                        type="monotone" 
                        dataKey="percentGrowth" 
                        stroke="#c333fd" 
                        name="Month" 
                        strokeWidth={2} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgramMonthlyGrowth;
