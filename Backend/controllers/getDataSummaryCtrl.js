import promisePool from '../config/database.js';

const getDataSummaryCtrl = {
  /**
   * Fetch all relavent data for AI model to read, analyze, and provide data summaries.
   */
  getInternSummary: async (req, res) => {
    try {
      const query = `
            SELECT
            i.InternID,
            i.firstName,
            i.lastName,
            i.departmentID,
            d.departmentName,
            i.location,

            cs.toolID AS current_toolID,
            t1.toolName AS current_toolName,
            cs.skillLevel AS current_skillLevel,

            ins.toolID AS initial_toolID,
            t2.toolName AS initial_toolName,
            ins.initialSkillLevel AS initial_skillLevel,

            sh.toolID AS history_toolID,
            t3.toolName AS history_toolName,
            sh.previousSkillLevel,
            sh.updatedSkillLevel,
            sh.skillIncrease,
            sh.changeDate

            FROM bizznestflow2.interns AS i

            INNER JOIN bizznestflow2.departments AS d
            ON i.departmentID = d.departmentID

            LEFT JOIN bizznestflow2.skills AS cs
            ON i.InternID = cs.InternID

            LEFT JOIN bizznestflow2.tools AS t1
            ON cs.toolID = t1.toolID

            LEFT JOIN bizznestflow2.initialSkills AS ins
            ON i.InternID = ins.InternID

            LEFT JOIN bizznestflow2.tools AS t2
            ON ins.toolID = t2.toolID

            LEFT JOIN bizznestflow2.skillHistory AS sh
            ON i.InternID = sh.InternID

            LEFT JOIN bizznestflow2.tools AS t3
            ON sh.toolID = t3.toolID;
      `;

      const [rows] = await promisePool.execute(query);

const internMap = new Map();

rows.forEach(row => {
  if (!internMap.has(row.InternID)) {
    internMap.set(row.InternID, {
      InternID: row.InternID,
      firstName: row.firstName,
      lastName: row.lastName,
      departmentID: row.departmentID,
      location: row.location,
      departmentName: row.departmentName,
      currentSkillLevels: [],
      initialSkillLevels: [],
      skillHistory: [],
      _seenSkillHistory: new Set(), // 🛡️ Track toolID + changeDate
    });
  }

  const intern = internMap.get(row.InternID);

  // -- Add current skills if not already present --
  if (row.current_toolID !== null && 
      !intern.currentSkillLevels.find(skill => skill.toolID === row.current_toolID)) {
    intern.currentSkillLevels.push({
      toolID: row.current_toolID,
      toolName: row.current_toolName,
      SkillLevel: row.current_skillLevel,
    });
  }

  // -- Add initial skills if not already present --
  if (row.initial_toolID !== null && 
      !intern.initialSkillLevels.find(skill => skill.toolID === row.initial_toolID)) {
    intern.initialSkillLevels.push({
      toolID: row.initial_toolID,
      toolName: row.initial_toolName,
      initialSkillLevel: row.initial_skillLevel,
    });
  }

  // -- Add to skillHistory if this (toolID, changeDate) hasn't been added yet --
  if (row.history_toolID !== null) {
    const historyKey = `${row.history_toolID}_${row.changeDate}`;
    if (!intern._seenSkillHistory.has(historyKey)) {
      intern.skillHistory.push({
        toolID: row.history_toolID,
        toolName: row.history_toolName,
        previousSkillLevel: row.previousSkillLevel,
        updatedSkillLevel: row.updatedSkillLevel,
        skillIncrease: row.skillIncrease,
        changeDate: row.changeDate,
      });
      intern._seenSkillHistory.add(historyKey); // Mark it as seen
    }
  }
});

// -- Remove the private helper field before sending JSON --
const transformed = Array.from(internMap.values()).map(intern => {
  delete intern._seenSkillHistory;
  return intern;
});

res.status(200).json(transformed);

    } catch (error) {
      console.error('Error getting intern data summary:', error.message);
      res.status(500).json({ message: 'Error getting intern data summary' });
    }
  },

  /**
   * Fetch a specific project by ID
   */
  getProjectsSummary: async (req, res) => {
    try {
        const query = `
        SELECT
            p.projectID,
            p.projectTitle,
            p.departmentID,
            d.departmentName,
            p.status,

            pt.toolID AS toolAssociated_toolID,
            t1.toolName AS toolAssociated_toolName,
            pt.difficulty AS toolAssociated_difficulty,

            pi.internID,
            i.firstName,
            i.lastName,
            pi.role,

            pg.toolID AS growth_toolID,
            t2.toolName AS growth_toolName,
            pg.absoluteGrowth,
            pg.percentGrowth

            FROM bizznestflow2.projects AS p

            INNER JOIN bizznestflow2.departments AS d
            ON p.departmentID = d.departmentID

            LEFT JOIN bizznestflow2.projectTools AS pt
            ON p.projectID = pt.projectID

            LEFT JOIN bizznestflow2.tools AS t1
            ON pt.toolID = t1.toolID

            LEFT JOIN bizznestflow2.internProjects AS pi
            ON p.projectID = pi.projectID

            LEFT JOIN bizznestflow2.interns AS i
            ON pi.internID = i.InternID

            LEFT JOIN bizznestflow2.projectedGrowth AS pg
            ON pi.InternID = pg.InternID
            AND pg.projectID = p.projectID

            LEFT JOIN bizznestflow2.tools AS t2
            ON pg.toolID = t2.toolID;
  `;

  const [rows] = await promisePool.execute(query);

  const projectMap = new Map();
  
  rows.forEach(row => {
    if (!projectMap.has(row.projectID)) {
      projectMap.set(row.projectID, {
        projectID: row.projectID,
        projectTitle: row.projectTitle,
        departmentID: row.departmentID,
        departmentName: row.departmentName,
        status: row.status,
        toolsAssociated: [],
        internsAssociated: [],
        _toolsTracker: new Set(),     // Track unique tools
        _internsTracker: new Map(),   // Track unique interns
      });
    }
  
    const project = projectMap.get(row.projectID);
  
    // --- Add toolsAssociated ---
    if (row.toolAssociated_toolID !== null) {
      const toolKey = row.toolAssociated_toolID;
      if (!project._toolsTracker.has(toolKey)) {
        project.toolsAssociated.push({
          toolID: row.toolAssociated_toolID,
          toolName: row.toolAssociated_toolName,
          Difficulty: row.toolAssociated_difficulty,
        });
        project._toolsTracker.add(toolKey);
      }
    }
  
    // --- Add internsAssociated ---
    if (row.internID !== null) {
      if (!project._internsTracker.has(row.internID)) {
        project._internsTracker.set(row.internID, {
          InternID: row.internID,
          firstName: row.firstName,
          lastName: row.lastName,
          role: row.role,
          projectedGrowth: [],
          _growthTracker: new Set(),  // Track unique growths per tool
        });
      }
  
      const intern = project._internsTracker.get(row.internID);
  
      // --- Add projected growth per intern ---
      if (row.growth_toolID !== null) {
        const growthKey = `${row.growth_toolID}`;
        if (!intern._growthTracker.has(growthKey)) {
          intern.projectedGrowth.push({
            toolID: row.growth_toolID,
            toolName: row.growth_toolName,
            absoluteGrowth: row.absoluteGrowth,
            percentGrowth: row.percentGrowth,
          });
          intern._growthTracker.add(growthKey);
        }
      }
    }
  });
  
  // --- Final cleanup: Flatten interns and remove helper trackers ---
  const transformed = Array.from(projectMap.values()).map(project => {
    project.internsAssociated = Array.from(project._internsTracker.values()).map(intern => {
      delete intern._growthTracker;
      return intern;
    });
    delete project._toolsTracker;
    delete project._internsTracker;
    return project;
  });
  
  res.status(200).json(transformed);

    } catch (error) {
      console.error('Error getting projects data summary:', error.message);
      res.status(500).json({ message: 'Error getting projects data summary' });
    }
  },
};

export default getDataSummaryCtrl;
