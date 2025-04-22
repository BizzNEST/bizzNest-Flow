import React from 'react';
import './Metrics.css';

// Import individual chart components
import ProjectWorkloadsChart from './workloads/workloads';
import MonthlyGrowth from './monthlyGrowth/monthlyGrowth';
import OverallGrowth from './overallGrowth/overallGrowth';
import DepartmentGrowth from './departmentGrowth/departmentGrowth';
import ProjectSummaries from './projectSummaries/projectSummaries';

/**
 * Metrics Component
 * Displays a dashboard of key metrics using different chart components
 * arranged in a responsive grid layout.
 */
const Metrics = () => {
  return (
    <div className="graph-container">

      {/* Top row contains Project Summaries and Monthly Growth */}
      <div className="row top-row">
        <div className="rectangle rectangle-small">
          {/* Project summaries table */}
          <ProjectSummaries />
        </div>

        <div className="rectangle rectangle-large">
          {/* Monthly growth line chart */}
          <MonthlyGrowth />
        </div>
      </div>

      {/* Bottom row contains Department Growth, Workloads, and Overall Growth */}
      <div className="row bottom-row">

        <div className="rectangle rectangle-third">
          {/* Department-level skill growth */}
          <DepartmentGrowth />
        </div>

        <div className="rectangle rectangle-third">
          {/* Bar chart showing top intern workloads */}
          <ProjectWorkloadsChart />
        </div>

        <div className="rectangle rectangle-third">
          {/* Radial chart showing overall skill growth */}
          <OverallGrowth />
        </div>
      </div>
      
    </div>
  );
};

export default Metrics;
