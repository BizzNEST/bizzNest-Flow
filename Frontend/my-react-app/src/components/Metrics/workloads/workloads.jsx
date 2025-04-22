import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import './workloads.css';

/**
 * ProjectWorkloadsChart Component
 * Visualizes the top 5 interns with the most active projects using a bar chart.
 */
const ProjectWorkloadsChart = () => {
  const [internWorkloads, setInternWorkloads] = useState([]);

  useEffect(() => {
    /**
     * Fetches intern workload data from the backend.
     * Sorts by number of active projects and keeps the top 5 interns.
     */
    const fetchWorkloads = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/internWorkloads`);
        const data = await response.json();

        if (data.internWorkloads) {
          // Sort by active project count (descending) and take top 5
          const sortedData = data.internWorkloads
            .sort((a, b) => b.activeProjects - a.activeProjects)
            .slice(0, 5);

          // Format data for recharts
          const formattedData = sortedData.map((intern) => ({
            name: intern.firstName, // Use first name for x-axis
            activeProjects: intern.activeProjects,
          }));

          setInternWorkloads(formattedData);
        }
      } catch (error) {
        console.error('Error fetching intern workloads:', error);
      }
    };

    fetchWorkloads();
  }, []);

  return (
    <div className="project-workloads-chart">
      <h3 className="chart-title">Project Workloads</h3>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={internWorkloads} barSize={50}>
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* X-axis displays intern names */}
          <XAxis dataKey="name" />

          {/* Y-axis shows count of active projects, whole numbers only */}
          <YAxis allowDecimals={false} />

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Optional legend (can be hidden if not needed) */}
          <Legend />

          {/* Bar display with gradient fill and label styling */}
          <Bar
            dataKey="activeProjects"
            fill="url(#gradient)"
            label={{ fill: 'white', fontSize: 16, fontWeight: 'bold' }}
          />

          {/* Define a gradient color fill for the bars */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f441a5" />
              <stop offset="100%" stopColor="#a832ff" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectWorkloadsChart;
