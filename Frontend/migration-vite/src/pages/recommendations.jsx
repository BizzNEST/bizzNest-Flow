/* pages/Recommendations.jsx */
import React, { useEffect, useState, useCallback, useRef } from "react"; // Added useRef
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/NavBar"; // Adjust path if needed
import RecModal from "../components/RecModal/RecModal";
import styles from "./Recommendations.module.css"; // Ensure CSS file exists and path is correct


// --- Constants ---
const toolNames = {
 0: "Frontend", 1: "Backend", 2: "Wordpress", 3: "Photoshop",
 4: "Illustrator", 5: "Figma", 6: "Premiere Pro", 7: "Camera Work",
};


// --- Component ---
const Recommendations = () => {
 // --- State ---
 const [projectData, setProjectData] = useState(null); // { projectID, title, tools }
 const [recommendationData, setRecommendationData] = useState([]); // skillDifferences array from payload
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const [grouped, setGrouped] = useState({}); // Recommendations grouped by toolID: { toolID: [internRec] }
 const [isAscending, setIsAscending] = useState(false); // Sort order: false=Learning, true=Leadership
 const [animationKey, setAnimationKey] = useState(0); // For list animations
 const [recModalOpen, setRecModalOpen] = useState(false);
 const [recModalInternData, setRecModalInternData] = useState(null);


 // Selection state (using numeric IDs)
 const [selectedInterns, setSelectedInterns] = useState(new Set()); // Use Set for efficient add/delete/has checks
 const [selectedLeaders, setSelectedLeaders] = useState(new Set()); // Use Set


 // Store initial assignments to check if changes were made before submitting
 const initialAssignmentsRef = useRef(new Map()); // Use ref to persist across re-renders without causing effect re-runs

 const location = useLocation();
 const navigate = useNavigate();

 // --- Helpers ---
 const getQueryParams = useCallback(() => {
   const qs = new URLSearchParams(location.search);
   return {
     projectID: qs.get("projectID"),
     departmentID: qs.get("departmentID"),
   };
 }, [location.search]);

// --- Modal open/close logic ---
// isOpen: boolean to determine if the modal should be shown
// onClose: function to call when closing the modal
// children: the content to display inside the modal

 // --- Grouping and Sorting Logic (Memoized) ---
 // This function now purely derives state from recommendationData and isAscending
 // It doesn't need to be in useEffect dependencies if its own dependencies are stable
 const groupAndSortRecommendations = useCallback((recommendations, asc) => {
   console.log("Grouping and sorting recommendations. Ascending:", asc);
   const groups = {};
   if (!recommendations || !Array.isArray(recommendations)) {
       console.warn("Cannot group/sort, invalid recommendations data provided.");
       return groups; // Return empty object
   }


   recommendations.forEach((intern) => {
     if (!intern || !Array.isArray(intern.calculations)) return;
     const numericInternID = Number(intern.InternID); // Ensure numeric
     if (isNaN(numericInternID)) {
       console.warn("Skipping intern with invalid ID:", intern.InternID);
       return;
     }


     intern.calculations.forEach((calc) => {
       if (!calc || typeof calc.toolID === 'undefined') return;
       const toolID = calc.toolID;
       if (!groups[toolID]) groups[toolID] = [];


       // Prevent duplicates within the same tool group
       if (!groups[toolID].some(existing => existing.internID === numericInternID)) {
         groups[toolID].push({
           internID: numericInternID, // Store as number
           name: `${intern.firstName || ''} ${intern.lastName || ''}`.trim() || `Intern ${numericInternID}`,
           percent: typeof calc.percentIncrease === 'number' ? calc.percentIncrease : 0,
           eligible: calc.eligibleForLeadership === true, // Ensure boolean
         });
       }
     });
   });


   // Sort each group
   Object.values(groups).forEach((arr) =>
     arr.sort((a, b) => {
       if (asc) { // Leadership sort: Eligible first, then by lowest % gain (already skilled)
         if (a.eligible !== b.eligible) return b.eligible - a.eligible; // true (1) comes before false (0)
         return a.percent - b.percent; // Lower % gain is better for leadership
       } else { // Learning sort: Highest % gain first
         return b.percent - a.percent;
       }
     })
   );
   console.log("Grouping complete:", groups);
   return groups; // Return the result
 }, []); // No dependencies needed here


 // --- Data Fetching ---
 useEffect(() => {
   const { projectID, departmentID } = getQueryParams();
   console.log("Effect triggered: Fetching data for", { projectID, departmentID });


   // Reset state on parameter change or initial load
   setIsLoading(true);
   setError(null);
   setProjectData(null);
   setRecommendationData([]);
   setGrouped({});
   setSelectedInterns(new Set()); // Reset selections
   setSelectedLeaders(new Set());
   initialAssignmentsRef.current = new Map(); // Reset initial state ref


   if (!projectID || !departmentID) {
     setError("Missing projectID or departmentID in URL.");
     setIsLoading(false);
     console.error("Fetch aborted: Missing URL parameters.");
     return;
   }
   const numericProjectID = Number(projectID);
    if (isNaN(numericProjectID)) {
        setError("Invalid Project ID in URL.");
        setIsLoading(false);
         console.error("Fetch aborted: Invalid Project ID.");
        return;
   }


   let isMounted = true; // Prevent state updates on unmounted component


   (async () => {
     try {
       const apiUrl = `${import.meta.env.VITE_API_URL}/recommendations?projectID=${projectID}&departmentID=${departmentID}`;
       console.log(`Workspaceing from: ${apiUrl}`);
       const res = await fetch(apiUrl);


       // Always try to parse JSON, even for errors, to get backend message
       let payload;
       try {
           payload = await res.json();
       } catch (parseError) {
           console.error("Failed to parse JSON response:", parseError);
           // If JSON parsing fails, create an error based on HTTP status
           throw new Error(`Server returned non-JSON response with status: ${res.status} ${res.statusText}`);
       }


       if (!isMounted) {
           console.log("Component unmounted during fetch, aborting state update.");
           return;
       }


       console.log("Received raw payload:", JSON.stringify(payload, null, 2)); // Log the raw payload


       if (!res.ok) {
         console.error(`Recommendations fetch failed (Status: ${res.status}):`, payload);
         throw new Error(payload?.message || `HTTP error! status: ${res.status} ${res.statusText}`);
       }


       // --- Payload Validation ---
        if (!payload || typeof payload !== 'object') {
            throw new Error("Received invalid (non-object) payload from server.");
        }
        if (!payload.projects || !Array.isArray(payload.projects) || payload.projects.length === 0) {
           throw new Error("Received invalid or empty project data structure from server.");
        }
        // CRITICAL CHECK: Ensure assignedInterns is an array (even if empty)
        if (!payload.assignedInterns || !Array.isArray(payload.assignedInterns)) {
            console.error("Payload validation failed: 'assignedInterns' is missing or not an array.", payload);
            throw new Error("Received incomplete data structure from server (missing or invalid 'assignedInterns' array).");
        }
        // Also validate skillDifferences for safety
        if (!payload.skillDifferences || !Array.isArray(payload.skillDifferences)) {
             console.warn("Payload warning: 'skillDifferences' is missing or not an array. Recommendations might be empty.", payload);
             // Allow proceeding, but recommendations will be empty
             payload.skillDifferences = []; // Ensure it's an empty array if missing/invalid
        }
       // --- End Payload Validation ---




       // --- Process Valid Payload ---
       console.log("Payload validation successful. Processing data...");


       // 1. Project Data
       const projectInfo = payload.projects[0];
       projectInfo.tools = Array.isArray(projectInfo.tools) ? projectInfo.tools : []; // Ensure tools is array
       setProjectData(projectInfo);
       console.log("Processed project data:", projectInfo);


       // 2. Recommendation Data (Skill Differences)
       setRecommendationData(payload.skillDifferences); // Store the raw recommendations
       console.log(`Stored ${payload.skillDifferences.length} skill difference entries.`);




       // 3. ********** KEY CHANGE: Initial Selections from assignedInterns **********
       const initialInternSet = new Set();
       const initialLeaderSet = new Set();
       const initialAssignmentMap = new Map(); // Local map for processing


       console.log(`Processing ${payload.assignedInterns.length} assigned interns for initial state...`);
       payload.assignedInterns.forEach((assignment) => {
           const internID = Number(assignment.InternID); // Ensure numeric ID
           if (isNaN(internID)) {
               console.warn("Skipping assigned intern with invalid ID:", assignment.InternID);
               return;
           }
           const role = String(assignment.role || 'Intern').trim(); // Default to Intern, ensure string


           if (role === "Leader") {
               initialLeaderSet.add(internID);
               initialAssignmentMap.set(internID, "Leader");
               console.log(` - Initial Leader: ID ${internID}`);
           } else { // Default to Intern if role is not explicitly "Leader"
               initialInternSet.add(internID);
               initialAssignmentMap.set(internID, "Intern");
                console.log(` - Initial Intern: ID ${internID}`);
           }
       });


       // Update state based on processed assignments
       setSelectedInterns(initialInternSet);
       setSelectedLeaders(initialLeaderSet);
       initialAssignmentsRef.current = initialAssignmentMap; // Store the initial map in the ref


       console.log("Initial selections set:", {
           interns: Array.from(initialInternSet),
           leaders: Array.from(initialLeaderSet),
           map: initialAssignmentMap
       });
       // ********** END KEY CHANGE **********




       // 4. Group and Sort Recommendations (using the fetched data, AFTER setting initial state)
       // We pass recommendationData directly, no need to rely on state here as it's available
       const groupedData = groupAndSortRecommendations(payload.skillDifferences, isAscending);
       setGrouped(groupedData); // Update the grouped state used for rendering




     } catch (e) {
       if (isMounted) {
         setError(e.message || "Failed to fetch or process recommendations");
         console.error("❌ Error in Recommendations fetch/process:", e);
       }
     } finally {
       if (isMounted) {
         setIsLoading(false);
         console.log("Fetch process finished. isLoading set to false.");
       }
     }
   })();


    // Cleanup function
    return () => {
        console.log("Recommendations component unmounting or dependencies changed.");
        isMounted = false;
    }


 // Rerun effect only if query params change (project/department)
 }, [location.search, getQueryParams, groupAndSortRecommendations, isAscending]); // Add isAscending here so sorting reruns when toggled




 // --- Event Handlers ---
 const toggleIntern = useCallback((id) => {
   id = Number(id);
   if (isNaN(id)) return;
   console.log(`Toggling Intern: ID ${id}`);
   setSelectedInterns((prev) => {
       const next = new Set(prev);
       if (next.has(id)) {
           next.delete(id);
       } else {
           next.add(id);
           // Ensure not also selected as leader
           setSelectedLeaders(leaders => {
               const nextLeaders = new Set(leaders);
               nextLeaders.delete(id);
               return nextLeaders;
           });
       }
       return next;
   });
 }, []); // No dependencies needed


 const toggleLeader = useCallback((id) => {
   id = Number(id);
   if (isNaN(id)) return;
    console.log(`Toggling Leader: ID ${id}`);
   setSelectedLeaders((prev) => {
       const next = new Set(prev);
       if (next.has(id)) {
           next.delete(id);
       } else {
           next.add(id);
           // Ensure not also selected as intern
           setSelectedInterns(interns => {
               const nextInterns = new Set(interns);
               nextInterns.delete(id);
               return nextInterns;
           });
       }
       return next;
   });
 }, []); // No dependencies needed


 const toggleOrder = useCallback(() => {
   console.log("Toggling sort order.");
   setIsAscending(prev => !prev);
   // Re-grouping/sorting is handled by the useEffect dependency change
   setAnimationKey(k => k + 1); // Trigger animation reset
 }, []);


const submitChanges = useCallback(async () => {
   const { projectID } = getQueryParams();
   const numericProjectID = Number(projectID);
   if (!projectID || isNaN(numericProjectID)) {
     alert("Error: Invalid or Missing Project ID. Cannot submit.");
     console.error("Submit aborted: Invalid Project ID.");
     return;
   }


   // Create the desired state from current selections
   const desiredAssignments = [
     ...Array.from(selectedInterns).map(id => ({ internID: id, role: "Intern", projectID: numericProjectID })),
     ...Array.from(selectedLeaders).map(id => ({ internID: id, role: "Leader", projectID: numericProjectID })),
   ];


   // Compare current state with initial state (stored in ref) to see if changes occurred
   const currentAssignmentsMap = new Map(desiredAssignments.map(a => [a.internID, a.role]));
   const initialAssignmentMap = initialAssignmentsRef.current;


   let hasChanged = false;
   if (currentAssignmentsMap.size !== initialAssignmentMap.size) {
       hasChanged = true;
   } else {
       for (const [id, role] of currentAssignmentsMap) {
           if (initialAssignmentMap.get(id) !== role) {
               hasChanged = true;
               break;
           }
       }
       // Check if any initial assignments were removed (needed if size is the same but items changed)
       if (!hasChanged) {
            for (const id of initialAssignmentMap.keys()) {
               if (!currentAssignmentsMap.has(id)) {
                   hasChanged = true;
                   break;
               }
            }
       }
   }


   // Allow submitting an empty list even if it was initially empty (to explicitly clear)
   if (!hasChanged && desiredAssignments.length > 0) {
     alert("No changes were made to the assignments.");
     console.log("Submit cancelled: No changes detected.");
     return;
   }
    if (!hasChanged && desiredAssignments.length === 0 && initialAssignmentMap.size === 0){
        alert("No changes were made (project remains empty).");
        console.log("Submit cancelled: No changes, project remains empty.");
        return;
    }




   console.log("Submitting changes. Desired assignments:", desiredAssignments);
   setIsLoading(true); // Indicate loading state


   try {
      const endpoint = `${import.meta.env.VITE_API_URL}/assignIntern`;
      // The backend assignInternCtrl handles empty arrays by checking req.body.length
      // It can get projectID from the payload itself if not empty,
      // or needs it from query/params if the body *is* empty.
      // Sending it in the payload for each item is robust.
      // Let's ensure the backend correctly handles getting projectID from the first item OR query param.
      // (The provided assignInternCtrl seems to do this).


      const res = await fetch(endpoint, { // Send to base endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desiredAssignments), // Send the full list
      });


     const responseData = await res.json().catch(() => ({})); // Try to parse JSON response


     if (res.ok) {
       console.log("Assignments updated successfully:", responseData);
       navigate(`/project/${numericProjectID}`); // Navigate back on success
     } else {
        console.error(`Failed to update assignments (Status: ${res.status}):`, responseData);
       throw new Error(responseData?.message || `Failed to update assignments (Status: ${res.status})`);
     }
   } catch (err) {
     console.error("❌ submitChanges fetch error:", err);
     alert(`An error occurred while saving: ${err.message}`);
     // Keep loading indicator off if error occurs so user can try again
     setIsLoading(false);
   }
   // Do not set isLoading to false here if navigation occurs on success
 }, [selectedInterns, selectedLeaders, getQueryParams, navigate]);




 // --- UI Helpers (grad, leaderGrad - unchanged) ---
 const grad = (p) => {
   p = typeof p === 'number' ? p : 0;
   return p >= 5 ? "linear-gradient(to bottom,#356086,#25FFC1)"
        : p >= 0 ? "linear-gradient(to bottom,rgb(206,91,42),rgb(251,179,45))"
        : "linear-gradient(to bottom,rgb(174,40,40),#EF2BD2)";
 }
 const leaderGrad = (eligible) =>
   eligible ? "linear-gradient(to bottom,#356086,#25FFC1)"
            : "linear-gradient(to bottom,rgb(174,40,40),#EF2BD2)";

const getTextColor = (rec, isAsc) => {
  const gradient = isAsc ? leaderGrad(rec.eligible) : grad(rec.percent);
  if (gradient.includes("#c333fd")) return "#c333fd"; // violet
  if (gradient.includes("#00bcd4")) return "#00bcd4"; // cyan
  if (gradient.includes("#ef2bd2")) return "#ef2bd2"; // pink
  return "#ffffff"; // fallback
};


 // --- Render Logic ---
 // Initial loading state
 if (isLoading && !projectData && !error) {
      return <div className={styles.loadingContainer}><NavBar /><p className={styles.loadingText}>Loading Recommendations...</p></div>;
 }


 // Error display state
 if (error) {
      return <div className={styles.errorContainer}><NavBar /><p className={styles.errorText}>Error: {error}</p><button onClick={() => window.location.reload()}>Retry</button></div>;
 }


 // Data loaded but projectData is missing (should be caught by error handling, but safeguard)
 if (!projectData) {
      return <div className={styles.errorContainer}><NavBar /><p className={styles.errorText}>Could not load project data. Please try again.</p><button onClick={() => window.location.reload()}>Retry</button></div>;
 }


 // --- Calculate Average Difficulty ---
 const projectTools = projectData.tools || [];
 const validTools = projectTools.filter(t => typeof t.difficulty === 'number');
 const avgDifficulty = validTools.length > 0
   ? (validTools.reduce((sum, t) => sum + t.difficulty, 0) / validTools.length).toFixed(1)
   : "N/A";


 // --- Main Render ---
 return (
   <div className={styles.recommendationsContainer}>
     <NavBar />


     {/* Project Stats Header (Unchanged) */}
      <div className={styles.projectStats}>
       <div className={styles.projectTitle}>
         <div className={styles.titleBox}>{projectData.projectTitle || "Unnamed Project"}</div>
       </div>
       <div className={styles.difficulty}>
         {projectTools.length > 0 ? projectTools.map((t) => (
           <div key={`proj-tool-${t.toolID}`} className={styles.toolBox}>
             <h4>{toolNames[t.toolID] || `Tool ${t.toolID}`}</h4>
             <div className={styles.toolBoxes}>{typeof t.difficulty === 'number' ? t.difficulty.toFixed(1) : 'N/A'}</div>
           </div>
         )) : <p className={styles.noToolsMsg}>No tools assigned.</p>}
       </div>
       <div className={styles.averageDifficulty}>
         <h4>Average</h4>
         <div className={styles.avgBox}>{avgDifficulty}</div>
       </div>
     </div>


     {/* Recommendations Section Header (Unchanged) */}
      <div className={styles.recommendationsHeader}>
        <h2>
         Recommended for{" "}
         <span style={{ color: "#25FFC1" }}>{isAscending ? "Project Leadership" : "Optimized Learning"}</span>
       </h2>
     </div>




     {/* Recommendations Grid - KEY RENDERING CHANGES HERE */}
     <div className={styles.suggestionsContainer}>
       {projectTools.length === 0 ? (
           <p className={styles.noRecommendationsOverall}>No tools assigned to this project, cannot show recommendations.</p>
       ) : (
           projectTools.map((tool) => (
               <div key={`rec-tool-${tool.toolID}`} className={`tool-row-${tool.toolID}`}>
               <h3 className={styles.toolHeader}>{toolNames[tool.toolID] || `Tool ${tool.toolID}`}</h3>
               <div className={styles.tabletRows}>
                   <div className={styles.rowTablets}>
                   {/* Use optional chaining and check length */}
                   {!grouped?.[tool.toolID] || grouped[tool.toolID]?.length === 0 ? (
                       <p className={styles.noRecommendations}>No interns recommended for this skill.</p>
                   ) : (
                       // Use grouped data which is derived from recommendationData
                       grouped[tool.toolID].map((internRec, idx) => {
                           // *** CHECK SELECTION STATE using the Sets ***
                           const isSelectedAsIntern = selectedInterns.has(internRec.internID);
                           const isSelectedAsLeader = selectedLeaders.has(internRec.internID);


                           return (
                               <div
                                   // Use a stable key combination
                                   key={`${tool.toolID}-${internRec.internID}`}
                                   className={`${styles.tablet} ${isSelectedAsIntern ? styles.selected : isSelectedAsLeader ? styles.leaderSelected : ""}`}
                                   style={{
                                            border: "2px solid transparent",
                                            borderRadius: "12px",
                                            backgroundImage: `linear-gradient(#191919, #191919), ${isAscending ? leaderGrad(internRec.eligible) : grad(internRec.percent)}`,
                                            backgroundOrigin: "border-box",
                                            backgroundClip: "padding-box, border-box",
                                            // color: getTextColor(internRec, isAscending)
                                  }}
                                   
                                   // Add animation class if needed, based on animationKey
                                   // className={`tablet ... ${animationKey > 0 ? 'fade-in' : ''}`}
                               >
                                <div 
                                  className={styles.tabletInfoButton}
                                  style={{ cursor: "pointer", position: "absolute", top: 8, right: 8 }}
                                  onClick={() => {
                                    setRecModalInternData(internRec); // store intern info
                                    setRecModalOpen(true);
                                  }}
                                  title="View more info"
                                  >
                                    🔍    
                                  </div>

                                   <div className={styles.tabletName}>{internRec.name}</div>
                                   <div className={styles.tabletPercent}>
                                       {isAscending
                                       ? (internRec.eligible ? "Eligible ⭐" : "Needs Growth")
                                       : (internRec.percent >= 0 ? `+${internRec.percent.toFixed(1)}%` : `${internRec.percent.toFixed(1)}%`) + " Gain"
                                       }
                                   </div>
                                   <div className={styles.tabletButtons}>
                                       {/* Intern Button: Show if not selected as Leader */}
                                       {!isSelectedAsLeader && (
                                           <button
                                               className={`${styles.assignButton} ${isSelectedAsIntern ? styles.selected : ""}`}
                                               onClick={() => toggleIntern(internRec.internID)}
                                               title={isSelectedAsIntern ? "Remove from Interns" : "Assign as Intern"}
                                               disabled={isLoading} // Disable during save
                                           >
                                               {/* Conditional text based on selection */}
                                               {isSelectedAsIntern ? "Intern ✔" : "Assign Intern"}
                                           </button>
                                       )}
                                       {/* Leader Button: Show if eligible AND not selected as Intern */}
                                       {internRec.eligible && !isSelectedAsIntern && (
                                           <button
                                               className={`${styles.leaderButton} ${isSelectedAsLeader ? styles.selected : ""}`}
                                               onClick={() => toggleLeader(internRec.internID)}
                                               title={isSelectedAsLeader ? "Remove from Leaders" : "Make Leader"}
                                               disabled={isLoading} // Disable during save
                                           >
                                               {/* Conditional text based on selection */}
                                               {isSelectedAsLeader ? "Leader ⭐" : "Make Leader"}
                                           </button>
                                       )}
                                       {/* Indicator if not eligible for Leadership when in Leadership view */}
                                       {!internRec.eligible && !isSelectedAsIntern && !isSelectedAsLeader && isAscending && (
                                           <span className={styles.notEligibleInfo}>(Skill &lt; Difficulty)</span>
                                       )}
                                   </div>
                               </div>
                           );
                       })
                   )}
                   </div>
               </div>
               </div>
           ))
       )}
     </div>




     {/* Bottom Controls (Unchanged Structure, ensure disabled state works) */}
     <div className={styles.buttonsContainer}>
       <div className={styles.switchButton}>
         <label className={styles.switch}>
           <input type="checkbox" checked={isAscending} onChange={toggleOrder} disabled={isLoading} />
           <span className={`${styles.slider} ${styles.round}`}></span>
         </label>
         <p>Toggle to Potential Leaders</p>
       </div>
       <div className={styles.recommendationSubmitButton}>
         <button className={styles.submit} onClick={submitChanges} disabled={isLoading}>
           {/* Show loading state text */}
           {isLoading ? "Saving..." : "Save Assignments"}
         </button>
       </div>
     </div>
     {/* <RecModal isOpen={recModalOpen} onClose={() => setRecModalOpen(false)}>
      {recModalInternData && (
        <div>
          <h2 className="text-x1 font-bold mb-2">{recModalInternData.name}</h2>
          <p>{isAscending ? "Leadership Candidate" : "Learning Opportunity"}</p>
          <p>
            {isAscending
            ? recModalInternData.eligible ? "Eligable for leadership" : "Not eligible"
            : `Potential Growth: ${recModalInternData.percent.toFixed(1)}%`}
          </p>
          
        </div>
      )}
     </RecModal> */}
   </div>
 );
};


export default Recommendations;