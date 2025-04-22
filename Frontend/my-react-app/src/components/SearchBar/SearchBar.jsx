import React, { useState } from 'react';

/**
 * SearchBar Component
 * A simple search input field that sends the current query to the parent component.
 *
 * @param {Function} onSearch - Callback to pass the input value upward as the user types
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState(''); // Holds the current search input

  /**
   * Handles user input and passes the query to the parent via onSearch
   * @param {Object} event - The input change event
   */
  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);       // Update local state
    onSearch(value);       // Trigger parent callback with new value
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
};

export default SearchBar;
