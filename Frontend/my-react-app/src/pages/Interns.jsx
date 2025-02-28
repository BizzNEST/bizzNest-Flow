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

const departmentMap = {
  0: "Web Development",
  1: "Design",
  2: "Video",
};

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "single" or "bulk"

  const filterInterns = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3360/getInterns")
      .then((response) => response.json())
      .then((data) => {
        filterInterns.current = data;
        setInterns(data);
        setFilteredInterns(data);
      })
      .catch((error) => console.error("Error fetching interns:", error));
  }, []);

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
          `http://localhost:3360/deleteIntern/${deleteTarget}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Intern deleted successfully");
          setInterns((prev) =>
            prev.filter((intern) => intern.InternID !== deleteTarget)
          );
          setFilteredInterns((prev) =>
            prev.filter((intern) => intern.InternID !== deleteTarget)
          );
          setSelectedInterns((prev) =>
            prev.filter((id) => id !== deleteTarget)
          );
        } else {
          alert(data.message);
        }
      } else if (deleteType === "bulk") {
        const response = await fetch(
          `http://localhost:3360/deleteSelectedInterns`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internIDs: selectedInterns }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Selected interns deleted successfully");
          setInterns((prev) =>
            prev.filter((intern) => !selectedInterns.includes(intern.InternID))
          );
          setFilteredInterns((prev) =>
            prev.filter((intern) => !selectedInterns.includes(intern.InternID))
          );
          setSelectedInterns([]);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting interns:", error);
      alert("Failed to delete intern(s)");
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="big-container">
      <NavBar />
      <div className="container">
        <div className="content">
          <div className="filtering-wrapper">
            <h3>Filter Interns</h3>
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
                >
                  Delete Selected
                </button>
              </div>
            </div>

            <h2>Interns:</h2>
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
                      src={intern.profilePic ? intern.profilePic : profile}
                      alt="Profile"
                      className="profile-pic"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profile; //targets default profile pic
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
