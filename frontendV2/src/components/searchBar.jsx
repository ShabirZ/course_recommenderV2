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
          className="w-120 h-20 border border-black text-black text-lg pt-0 text-center overflow-hidden"
          placeholder="CSCI 313"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      );
      
}

export default SearchBar;
