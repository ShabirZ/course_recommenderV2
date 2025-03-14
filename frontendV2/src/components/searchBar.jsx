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
            className="w-70 h-20 border border-black text-center text-black text-lg py-2"
            placeholder="CSCI 313"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Add the onKeyDown event handler
        />
    );
}

export default SearchBar;
