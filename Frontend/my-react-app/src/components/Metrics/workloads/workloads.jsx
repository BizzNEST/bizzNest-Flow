import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import './workloads.css';

const ProjectWorkloadsChart = () => {
  const [internWorkloads, setInternWorkloads] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchWorkloads = async () => {
      try {
        const response = await fetch('http://localhost:3360/internWorkloads');
        const data = await response.json();

        if (data.internWorkloads) {
          // Sort by activeProjects and take the top 5
          const sortedData = data.internWorkloads
            .sort((a, b) => b.activeProjects - a.activeProjects)
            .slice(0, 5);

          // Transform data for the chart
          const formattedData = sortedData.map((intern) => ({
            name: intern.firstName, // Display first names
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
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={internWorkloads} barSize={50}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="activeProjects" fill="url(#gradient)" label={{ fill: 'white', fontSize: 16, fontWeight: 'bold' }} />
          {/* Gradient effect */}
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