import React from 'react';
import './Metrics.css';
import ProjectWorkloadsChart from './workloads/workloads';
import MonthlyGrowth from './monthlyGrowth/monthlyGrowth';
import OverallGrowth from './overallGrowth/overallGrowth';
import DepartmentGrowth from './departmentGrowth/departmentGrowth';
import ProjectSummaries from './projectSummaries/projectSummaries';

const Metrics = () => {
  return (
    <div className="graph-container">
      <div className="row top-row">
        <div className="rectangle rectangle-small">
          
            {/* Project summaries graphic */}
            <ProjectSummaries />

        </div>
        <div className="rectangle rectangle-large">
          {/* <div className="monthly-growth"> */}
            {/* Monthly growth graph */}
            <MonthlyGrowth />
          {/* </div> */}
        </div>
      </div>
      <div className="row bottom-row">
        <div className="rectangle rectangle-third">

            <DepartmentGrowth />

        </div>
        <div className="rectangle rectangle-third">
          {/* <div className="project-workloads"> */}
            <ProjectWorkloadsChart />
        </div>
        <div className="rectangle rectangle-third">
          
            {/* Overall growth graph */}
            <OverallGrowth />

        </div>
      </div>
    </div>
  );
};

export default Metrics;