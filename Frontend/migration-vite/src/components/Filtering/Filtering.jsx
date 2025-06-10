import React from 'react';
import './Filtering.css';

const Filtering = ({
                       selectedDepartment,
                       setSelectedDepartment,
                       selectedLocation,
                       setSelectedLocation,
                       onApplyFilters,
                   }) => {
    return (
        <div className="filtering">

            {/* Dropdown for Department */}
            <div>
                <label htmlFor="department">Department</label>
                <select
                    id="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="">All Departments</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design">Design</option>
                    <option value="Video">Video</option>
                </select>
            </div>

            {/* Dropdown for Location */}
            <div>
                <label htmlFor="location">Location</label>
                <select
                    id="location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value="">All Locations</option>
                    <option value="Salinas">Salinas</option>
                    <option value="Watsonville">Watsonville</option>
                    <option value="Gilroy">Gilroy</option>
                    <option value="Stockton">Stockton</option>
                    <option value="Modesto">Modesto</option>
                </select>
            </div>

            <button onClick={onApplyFilters}>Apply Filters</button>
        </div>
    );
};

export default Filtering;