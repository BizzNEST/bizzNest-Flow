import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/NavBar";
import SearchBar from "../components/SearchBar/SearchBar";
import Filtering from "../components/Filtering/Filtering";
import ConfirmPopup from "../components/ConfirmPopup/ConfirmPopup";
import edit from "../assets/edit.svg";
import del from "../assets/delete.svg";
import profile from "../assets/profile.svg";
import "./Interns.css";

// Cache expiration time (1 hour)
const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const departmentMap = {
  0: "Web Development",
  1: "Design",
  2: "Video",
};

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [internsWithProfilePics, setInternsWithProfilePics] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"
  const [error, setError] = useState(null);

  const filterInterns = useRef([]);
  const navigate = useNavigate();

  // Check if cache is expired
  const isCacheValid = (cacheTimestamp) => {
    return cacheTimestamp && Date.now() - cacheTimestamp < CACHE_EXPIRY_TIME;
  };

  // Fetch all interns (with caching)
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const cachedData = localStorage.getItem("cachedInterns");
        const cacheTimestamp = localStorage.getItem("cacheTimestamp");

        if (cachedData && isCacheValid(Number(cacheTimestamp))) {
          // Use cached data if valid
          const parsedData = JSON.parse(cachedData);
          filterInterns.current = parsedData;
          setInterns(parsedData);
        } else {
          // Fetch fresh data if cache is invalid/expired
          const response = await fetch(`${process.env.REACT_APP_API_URL}/getInterns`);
          if (!response.ok) throw new Error("Failed to fetch interns");

          const data = await response.json();
          localStorage.setItem("cachedInterns", JSON.stringify(data));
          localStorage.setItem("cacheTimestamp", Date.now()); // Update timestamp

          filterInterns.current = data;
          setInterns(data);
        }
      } catch (err) {
        setError("Failed to load interns. Using cached data if available.");
        console.error("Error fetching interns:", err);

        // Fallback to cache even if expired
        const cachedData = localStorage.getItem("cachedInterns");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          filterInterns.current = parsedData;
          setInterns(parsedData);
        }
      }
    };

    fetchInterns();
  }, []);

  // Fetch & cache profile pictures (only if missing or expired)
  useEffect(() => {
    if (interns.length === 0) return;

    const fetchProfilePictures = async () => {
      const updatedInterns = await Promise.all(
        interns.map(async (intern) => {
          const cacheKey = `profilePic_${intern.InternID}`;
          const cachedPic = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

          // Use cached profile pic if valid
          if (cachedPic && isCacheValid(Number(cacheTimestamp))) {
            return { ...intern, profilePic: cachedPic };
          }

          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/getIntern/${intern.InternID}`
            );
            if (!response.ok) throw new Error("Failed to fetch profile picture");

            const data = await response.json();
            let profilePic = profile; // Default

            if (data.profilePic) {
              const decodedPath = atob(data.profilePic);
              profilePic = `${process.env.REACT_APP_API_URL}${decodedPath}`;
            }

            // Cache the profile picture
            localStorage.setItem(cacheKey, profilePic);
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now());

            return { ...intern, profilePic };
          } catch (err) {
            console.error("Error fetching profile picture:", err);
            return { ...intern, profilePic: cachedPic || profile }; // Fallback
          }
        })
      );

      filterInterns.current = updatedInterns;
      setInternsWithProfilePics(updatedInterns);
      setFilteredInterns(updatedInterns);
    };

    fetchProfilePictures();
  }, [interns]);

  // Select or Deselect an Intern
  const handleSelectIntern = (internID) => {
    setSelectedInterns((prevSelected) => {
      if (prevSelected.includes(internID)) {
        return prevSelected.filter((id) => id !== internID);
      } else {
        return [...prevSelected, internID];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedInterns(filteredInterns.map((intern) => intern.InternID));
  };

  const handleDeselectAll = () => {
    setSelectedInterns([]);
  };

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    const results = filterInterns.current.filter((intern) => {
      const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
      return fullName.includes(lowerQuery);
    });
    setFilteredInterns(results);
  };

  const handleFilterApply = () => {
    const results = filterInterns.current.filter((intern) => {
      const matchesDepartment = selectedDepartment
        ? departmentMap[intern.departmentID] === selectedDepartment
        : true;
      const matchesLocation = selectedLocation
        ? intern.location === selectedLocation
        : true;

      return matchesDepartment && matchesLocation;
    });

    setFilteredInterns(results);
  };

  // Function to show the confirmation popup
  const confirmDelete = (id, type) => {
    setDeleteTarget(id);
    setDeleteType(type);
    setShowPopup(true);
  };

  // Function to execute the confirmed delete
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget && deleteType === "bulk" && selectedInterns.length === 0)
      return;

    try {
      if (deleteType === "single") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/deleteIntern/${deleteTarget}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        if (response.ok) {
          // Update cache after deletion
          const updatedInterns = interns.filter(
            (intern) => intern.InternID !== deleteTarget
          );
          localStorage.setItem("cachedInterns", JSON.stringify(updatedInterns));
          localStorage.setItem("cacheTimestamp", Date.now());

          setInterns(updatedInterns);
          setFilteredInterns(updatedInterns);
          setSelectedInterns((prev) =>
            prev.filter((id) => id !== deleteTarget)
          );
        } else {
          alert(data.message);
        }
      } else if (deleteType === "bulk") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/deleteSelectedInterns`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internIDs: selectedInterns }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Update cache after bulk deletion
          const updatedInterns = interns.filter(
            (intern) => !selectedInterns.includes(intern.InternID)
          );
          localStorage.setItem("cachedInterns", JSON.stringify(updatedInterns));
          localStorage.setItem("cacheTimestamp", Date.now());

          setInterns(updatedInterns);
          setFilteredInterns(updatedInterns);
          setSelectedInterns([]);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting interns:", error);
      setError("Failed to delete intern(s). Please try again.");
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="big-container">
      <NavBar />
      {error && <div className="error-message">{error}</div>}
      <div className="container">
        <div className="content">
          <div className="filtering-wrapper">
            <h3 className="filter-header">Filter Interns</h3>
            <div className="search-bar-wrapper">
              <SearchBar onSearch={handleSearch} />
            </div>
            <Filtering
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onApplyFilters={handleFilterApply}
            />
          </div>

          <div className="interns-wrapper">
            <div className="select-buttons">
              <div className="select-left">
                <button className="select-btn" onClick={handleSelectAll}>
                  Select All
                </button>
                <button className="deselect-btn" onClick={handleDeselectAll}>
                  Deselect All
                </button>
              </div>
              <div className="delete-right">
                <button
                  className="delete-selected-btn"
                  onClick={() => confirmDelete(null, "bulk")}
                  disabled={selectedInterns.length === 0}
                >
                  Delete Selected
                </button>
              </div>
            </div>

            <h2 className="interns-header">Interns</h2>
            <div className="intern-container">
              <ul>
                {filteredInterns.map((intern) => (
                  <li
                    key={intern.InternID}
                    onClick={() => handleSelectIntern(intern.InternID)}
                    className={
                      selectedInterns.includes(intern.InternID)
                        ? "selected"
                        : ""
                    }
                  >
                    <img
                      src={intern.profilePic}
                      alt="Profile"
                      className="profile-pic"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profile; // Fallback to default profile pic
                      }}
                    />
                    <span className="name">
                      {intern.firstName} {intern.lastName}
                    </span>
                    <div className="icon-container">
                      <img
                        src={edit}
                        alt="edit"
                        className="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editIntern/${intern.InternID}`);
                        }}
                      />
                      <img
                        src={del}
                        alt="delete"
                        className="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(intern.InternID, "single");
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <ConfirmPopup
          message="Are you sure you want to delete?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Interns;