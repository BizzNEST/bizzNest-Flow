import React, { useEffect, useState } from "react";
import styles from "./projectSummaries.module.css";

const departmentMap = {
    0: "WebDev",
    1: "Design",
    2: "Film"
};

const statusMap = {
    "In-Progress": { label: "Open", color: "yellow" },
    "Completed": { label: "Closed", color: "green" }
};

const ProjectSummaries = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjectSummaries = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/projectSummaries`);
                const data = await response.json();

                if (data?.projectSummaries) {
                    const formattedProjects = data.projectSummaries.map(project => ({
                        id: project.projectID,
                        title: project.projectTitle,
                        department: departmentMap[project.departmentID] || "Unknown",
                        status: statusMap[project.status]?.label || "Unknown",
                        statusColor: statusMap[project.status]?.color || "gray",
                        projectedGrowth: project.projectedGrowth.toFixed(2) + "%" // Ensures % formatting
                    }));

                    // ✅ Sort "Open" projects first
                    formattedProjects.sort((a, b) => (a.status === "Open" ? -1 : 1));

                    setProjects(formattedProjects);
                }
            } catch (error) {
                console.error("Error fetching project summaries:", error);
            }
        };

        fetchProjectSummaries();
    }, []);

    return (
        <div className={styles.projectSummariesContainer}>
            <h3 className={styles.tableTitle}>Project Summaries</h3>
            <div className={styles.tableWrapper}>
                <table className={styles.projectTable}>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Dep</th>
                            <th>Status</th>
                            <th>Proj. Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(({ id, title, department, status, statusColor, projectedGrowth }) => (
                            <tr key={id}>
                                <td>{title}</td>
                                <td>{department}</td>
                                <td>
                                <span className={`${styles.statusBadge} ${styles[statusColor]}`}>{status}</span>
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