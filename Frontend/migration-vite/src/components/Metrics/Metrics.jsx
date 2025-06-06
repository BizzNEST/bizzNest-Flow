import React from 'react';
import styles from './Metrics.module.css';
import ProjectWorkloadsChart from './workloads/workloads';
import MonthlyGrowth from './monthlyGrowth/monthlyGrowth';
import OverallGrowth from './overallGrowth/overallGrowth';
import DepartmentGrowth from './departmentGrowth/departmentGrowth';
import ProjectSummaries from './projectSummaries/projectSummaries';

const Metrics = () => {
  return (
    <div className={styles.graphContainer}>
      <div className={`${styles.row} ${styles.topRow}`}>
        <div className={`${styles.rectangle} ${styles.rectangleSmall}`}>
          
            {/* Project summaries graphic */}
            <ProjectSummaries />

        </div>
        <div className={`${styles.rectangle} ${styles.rectangleLarge}`}>
          {/* <div className="monthly-growth"> */}
            {/* Monthly growth graph */}
            <MonthlyGrowth />
          {/* </div> */}
        </div>
      </div>
      <div className={`${styles.row} ${styles.bottomRow}`}>
        <div className={`${styles.rectangle} ${styles.rectangleThird}`}>

            <DepartmentGrowth />

        </div>
        <div className={`${styles.rectangle} ${styles.rectangleThird}`}>
          {/* <div className="project-workloads"> */}
            <ProjectWorkloadsChart />
        </div>
        <div className={`${styles.rectangle} ${styles.rectangleThird}`}>
          
            {/* Overall growth graph */}
            <OverallGrowth />

        </div>
      </div>
    </div>
  );
};

export default Metrics;