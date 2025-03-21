import React, { useState } from 'react';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            alert(inputValue); // Or any other action
            // Check DB if exists
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <input
          className="w-120 h-20  rounded-lg shadow-md border border-black text-black text-lg pt-0 text-center overflow-hidden hover:scale-105 transition-all duration-300 "
          placeholder="CSCI 313"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      );
      
}

export default SearchBar;
