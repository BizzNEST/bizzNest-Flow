import React, { useEffect, useState } from "react";
import "./projectSummaries.css";

// Map numeric department IDs to department names
const departmentMap = {
    0: "WebDev",
    1: "Design",
    2: "Film"
};

// Map project statuses to display labels and badge colors
const statusMap = {
    "In-Progress": { label: "Open", color: "yellow" },
    "Completed": { label: "Closed", color: "green" }
};

/**
 * ProjectSummaries Component
 * Fetches and displays a table of project summaries with department,
 * status, and projected growth info.
 */
const ProjectSummaries = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch project summaries from the backend
        const fetchProjectSummaries = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/projectSummaries`);
                const data = await response.json();

                if (data?.projectSummaries) {
                    // Format and map each project’s data for display
                    const formattedProjects = data.projectSummaries.map(project => ({
                        id: project.projectID,
                        title: project.projectTitle,
                        department: departmentMap[project.departmentID] || "Unknown",
                        status: statusMap[project.status]?.label || "Unknown",
                        statusColor: statusMap[project.status]?.color || "gray",
                        projectedGrowth: project.projectedGrowth.toFixed(2) + "%" // Add % symbol
                    }));

                    // Sort to display "Open" projects before "Closed"
                    formattedProjects.sort((a, b) => (a.status === "Open" ? -1 : 1));

                    setProjects(formattedProjects);
                }
            } catch (error) {
                // Log any fetch errors
                console.error("Error fetching project summaries:", error);
            }
        };

        // Run once on component mount
        fetchProjectSummaries();
    }, []);

    return (
        <div className="project-summaries-container">
            <h3 className="table-title">Project Summaries</h3>

            {/* Responsive wrapper for horizontal scroll if needed */}
            <div className="table-wrapper">
                <table className="project-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Dep</th>
                            <th>Status</th>
                            <th>Proj. Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render each project row with status badge */}
                        {projects.map(({ id, title, department, status, statusColor, projectedGrowth }) => (
                            <tr key={id}>
                                <td>{title}</td>
                                <td>{department}</td>
                                <td>
                                    <span className={`status-badge ${statusColor}`}>{status}</span>
                                </td>
                                <td>{projectedGrowth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectSummaries;
