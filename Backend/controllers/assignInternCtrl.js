import promisePool from '../config/database.js';

const assignInternCtrl = {
  assignInternToProject: async (req, res) => {
    try {
      // console.log("Received request:", req.body); // Debug log

      const interns = req.body;

      if (!Array.isArray(interns) || !interns.length) {
        console.error("No interns received: ", req.body);
        return res.status(400).json({ message: 'InternID and ProjectID are required' });
      }

      // Step 1: Insert the intern into the internProjects table
      const insertInternQuery = `
        INSERT INTO bizznestflow2.internProjects (InternID, projectID, role)
        VALUES ${interns.map(() => "(?, ?, ?)").join(", ")}
        ON DUPLICATE KEY UPDATE role = VALUES(role);
      `;

      const values = interns.flatMap(({ internID, projectID, role }) => [internID, projectID, role || 'Intern']);
      await promisePool.execute(insertInternQuery, values);

      // Step 2: Fetch Calculations from recommendationsCtrl for the assigned interns
      const internIDs = interns.map(i => i.internID);
      const projectID = interns[0].projectID; // Assuming all interns belong to the same project

      const fetchCalculationsQuery = `
    SELECT 
      i.InternID,
      s.toolID,
      (pt.difficulty - s.skillLevel) AS difference,
      
      (10 / (s.skillLevel + EXP(-s.skillLevel))) AS dynamicCoefficient,
      
      ((pt.difficulty - s.skillLevel) * EXP(-POWER(pt.difficulty - s.skillLevel, 2)) * 
       (10 / (s.skillLevel + EXP(-s.skillLevel)))) AS absoluteGrowth,

      ((((pt.difficulty - s.skillLevel) * EXP(-POWER(pt.difficulty - s.skillLevel, 2)) * 
        (10 / (s.skillLevel + EXP(-s.skillLevel)))) / s.skillLevel) * 100) AS percentGrowth

    FROM 
      bizznestflow2.internProjects ip
    JOIN 
      bizznestflow2.interns i ON ip.InternID = i.InternID
    JOIN 
      bizznestflow2.skills s ON i.InternID = s.InternID
    JOIN 
      bizznestflow2.projectTools pt ON s.toolID = pt.toolID AND ip.projectID = pt.projectID
    WHERE 
      ip.projectID = ? AND i.InternID IN (${internIDs.map(() => "?").join(", ")})
      AND ip.status = 'In-Progress';
`;

      const [calculations] = await promisePool.execute(fetchCalculationsQuery, [projectID, ...internIDs]);

      // Step 3: Insert calculations into projectedGrowth table
      if (calculations.length > 0) {
        const insertGrowthQuery = `
          INSERT INTO bizznestflow2.projectedGrowth (InternID, projectID, toolID, absoluteGrowth, percentGrowth)
          VALUES ${calculations.map(() => "(?, ?, ?, ?, ?)").join(", ")}
          ON DUPLICATE KEY UPDATE 
            absoluteGrowth = CASE 
              WHEN VALUES(percentGrowth) < 0 THEN 0 
              ELSE VALUES(absoluteGrowth) 
            END,  
            percentGrowth = CASE 
              WHEN VALUES(percentGrowth) < 0 THEN 0 
              ELSE VALUES(percentGrowth) 
            END;
        `;

        const growthValues = calculations.flatMap(({ InternID, toolID, absoluteGrowth, percentGrowth }) => {
          const adjustedAbsoluteGrowth = percentGrowth < 0 ? 0 : Math.abs(parseFloat(absoluteGrowth)) || 0;
          const adjustedPercentGrowth = Math.max(0, parseFloat(percentGrowth.toFixed(2))); // Ensure percentGrowth is at least 0
        
          console.log(`InternID: ${InternID}, ToolID: ${toolID}, AbsoluteGrowth: ${adjustedAbsoluteGrowth}, PercentGrowth: ${adjustedPercentGrowth}`);
        
          return [InternID, projectID, toolID, adjustedAbsoluteGrowth, adjustedPercentGrowth];
        });                

        await promisePool.execute(insertGrowthQuery, growthValues);
      }

      res.status(200).json({ message: 'Intern assigned successfully and projected growth stored!' });
    } catch (error) {
      console.error('Error assigning intern and storing projected growth:', error.message);
      res.status(500).json({ message: 'Error assigning intern and storing projected growth' });
    }
  }
};

export default assignInternCtrl;