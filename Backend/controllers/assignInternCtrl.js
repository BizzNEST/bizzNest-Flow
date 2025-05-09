/* controllers/assignInternCtrl.js */
// No changes needed based on the description, assuming the existing logic is correct.
// Review the console logs during testing if saving doesn't work as expected.
import promisePool from "../config/database.js"; // Adjust path as needed


const assignInternCtrl = {
 assignInternToProject: async (req, res) => {
   const connection = await promisePool.getConnection();
   let projectID = null; // Keep track of projectID for logging/rollback


   try {
     const desiredAssignments = Array.isArray(req.body) ? req.body : [];
     console.log(`Received request to update assignments. Count: ${desiredAssignments.length}`);
     // console.log("Desired assignments payload:", JSON.stringify(desiredAssignments)); // Uncomment for detailed debug


     // --- Validation ---
     if (desiredAssignments.length > 0) {
       // Get projectID from the first item and validate
       projectID = Number(desiredAssignments[0].projectID);
       if (isNaN(projectID)) {
         throw new Error("Invalid projectID in payload.");
       }
       // Ensure all items belong to the same project
       if (desiredAssignments.some(d => Number(d.projectID) !== projectID)) {
         throw new Error("Inconsistent projectID in payload. All assignments must belong to the same project.");
       }
       // Ensure all internIDs are valid numbers
       if (desiredAssignments.some(d => isNaN(Number(d.internID)))) {
         throw new Error("Invalid internID found in assignment data.");
       }
       console.log(`Processing assignments for projectID: ${projectID}`);
     } else {
       // Handle empty array (clearing project) - Requires projectID from query or params
       projectID = Number(req.query.projectID); // Check query param first
       if (isNaN(projectID)) {
            projectID = Number(req.params.projectID); // Check path parameter as fallback
            if (isNaN(projectID)){
                // If still no valid ID, we cannot proceed
                console.error("Cannot clear assignments: Project ID is missing or invalid in query/params when assignment list is empty.");
                throw new Error("Cannot clear assignments: Project ID is missing or invalid (required when assignment list is empty).");
            }
       }
       console.log(`Received empty assignment list. Clearing assignments for projectID: ${projectID} (obtained from query/params).`);
     }


     // --- Database Synchronization within a Transaction ---
     await connection.beginTransaction();
     console.log(`Starting assignment transaction for projectID: ${projectID}`);


     // Get a list of numeric IDs for the WHERE clause
     const desiredInternIDs = desiredAssignments.map((a) => Number(a.internID));


     // 1️⃣ Delete existing assignments for this project NOT in the desired list
     // This handles removals effectively.
     let deleteQuery = `DELETE FROM bizznestflow2.internProjects WHERE projectID = ?`;
     const deleteParams = [projectID];


     if (desiredInternIDs.length > 0) {
       // If there are desired interns, only delete those NOT in the list
       const placeholders = desiredInternIDs.map(() => '?').join(',');
       deleteQuery += ` AND InternID NOT IN (${placeholders})`;
       deleteParams.push(...desiredInternIDs);
       console.log(`Transaction (${projectID}): Preparing to delete assignments NOT IN [${desiredInternIDs.join(', ')}]`);
     } else {
       // If the desired list is empty, the query without "NOT IN" deletes ALL for the projectID.
       console.log(`Transaction (${projectID}): Preparing to delete ALL assignments for this project.`);
     }


     const [deleteResult] = await connection.execute(deleteQuery, deleteParams);
     console.log(`Transaction (${projectID}): Deleted ${deleteResult.affectedRows} old/unwanted assignments.`);


     // 2️⃣ Upsert (Insert or Update) the desired assignments
     // This handles additions and role changes.
     if (desiredInternIDs.length > 0) {
       // IMPORTANT: Ensure your table `bizznestflow2.internProjects` has a
       // UNIQUE constraint on (InternID, projectID) for ON DUPLICATE KEY UPDATE to work correctly.
       const upsertQuery = `
         INSERT INTO bizznestflow2.internProjects (InternID, projectID, role, status)
         VALUES (?, ?, ?, 'In-Progress')
         ON DUPLICATE KEY UPDATE
           role = VALUES(role),
           status = VALUES(status) -- Or update status as needed
       `; // Added status update for robustness


       let insertedCount = 0;
       let updatedCount = 0;


       for (const assignment of desiredAssignments) {
         const internID = Number(assignment.internID);
         // Default to 'Intern' if role is missing or invalid, normalize case
         const role = (assignment.role && ['Intern', 'Leader'].includes(String(assignment.role).trim()))
                        ? String(assignment.role).trim()
                        : "Intern";


         // console.log(`Upserting: Intern ${internID}, Project ${projectID}, Role ${role}`); // Debug log
         const [upsertResult] = await connection.execute(upsertQuery, [
           internID,
           projectID,
           role,
         ]);


         // result.affectedRows: 1 for INSERT, 2 for UPDATE (in MySQL with ON DUPLICATE KEY UPDATE)
         if (upsertResult.affectedRows === 1) {
           insertedCount++;
         } else if (upsertResult.affectedRows === 2) {
           updatedCount++;
         } else {
             // Might be 0 if the row exists but no values changed (e.g., same role submitted again)
             // Treat as updated for logging purposes if needed, or ignore.
         }
       }
       console.log(`Transaction (${projectID}): Upserted assignments (Inserted: ${insertedCount}, Updated/No-Change: ${updatedCount + (desiredAssignments.length - insertedCount - updatedCount)}).`);
     } else {
        console.log(`Transaction (${projectID}): No desired assignments to upsert (project cleared or kept empty).`);
     }


     // --- Finalize ---
     await connection.commit();
     console.log(`✅ Transaction committed successfully for projectID: ${projectID}.`);
     res.status(200).json({ message: "Intern assignments updated successfully." });


   } catch (err) {
     // Rollback transaction on error
     console.error(`❌ Error during assignment update for projectID: ${projectID || 'UNKNOWN'}. Rolling back...`, err);
     if (connection) { // Only rollback if connection exists
         await connection.rollback();
         console.log(`Transaction rolled back for projectID: ${projectID || 'UNKNOWN'}.`);
     }


     // Determine appropriate status code
     const isClientError = err.message.includes("Invalid") || err.message.includes("Inconsistent") || err.message.includes("missing");
     const statusCode = isClientError ? 400 : 500;
     res.status(statusCode).json({ message: err.message || "Server error during assignment update." });


   } finally {
     // ALWAYS release the connection
     if (connection) {
       await connection.release();
       // console.log(`Connection released for projectID: ${projectID || 'UNKNOWN'}.`);
     }
   }
 },
};


export default assignInternCtrl;



