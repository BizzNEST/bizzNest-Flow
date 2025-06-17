import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from './monthlyGrowth.module.css';

const ProgramMonthlyGrowth = () => {
    const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);

    useEffect(() => {
        const fetchMonthlyGrowthData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/monthlyGrowth`);
                const data = await response.json();

                if (data?.monthlyMetrics) {
                    const sortedData = data.monthlyMetrics.sort((a, b) => 
                        new Date(a.month) - new Date(b.month)
                    ).map(entry => ({
                        formattedMonth: new Date(entry.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
                        percentGrowth: parseFloat(entry.percentGrowth.toFixed(2))
                    }));

                    setMonthlyGrowthData(sortedData);
                }
            } catch (error) {
                console.error("Error fetching monthly growth:", error);
            }
        };

        fetchMonthlyGrowthData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customToolTip}>
                    <p className={styles.toolTipLable}>{`Month: ${label}`}</p>
                    <p className={styles.toolTipValue}>
                        📊 Percentage Growth: <strong>{payload[0].value}%</strong>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.programMonthlyGrowthContainer}>
            <h3 className={styles.chartTitle}>Monthly Growth</h3>
            <ResponsiveContainer width={700} height={150}>
                <LineChart 
                    data={monthlyGrowthData} 
                    margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
                >
                    <XAxis 
                        dataKey="formattedMonth"
                        stroke="#566573"
                        angle={-30} 
                        textAnchor="end" 
                        tick={{ fontSize: 10 }} 
                        height={40}
                    />
                    <YAxis 
                        stroke="#566573"
                        label={{ value: "Growth (%)", angle: -90, dx: -25, paddingBottom: "10px", fontSize: 14, fontWeight: 10,  stroke: "#c333fd" }} 
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="percentGrowth" stroke="#c333fd" name="Month" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgramMonthlyGrowth;