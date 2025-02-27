import React from 'react';
import './Metrics.css';
import ProjectWorkloadsChart from './workloads/workloads';
import MonthlyGrowth from './monthlyGrowth/monthlyGrowth';
import OverallGrowth from './overallGrowth/overallGrowth';

const Metrics = () => {
  return (
    <div className="graph-container">
      <div className="row top-row">
        <div className="rectangle rectangle-small">
          <div className="project-summaries">
            {/* Project summaries graphic */}
          </div>
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
          <div className="department-growth">
            {/* Department growth graph */}
          </div>
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