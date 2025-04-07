import React, { useState } from 'react';
import axios from "axios";

function SearchBar() {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            console.log(inputValue);
            const response = await axios.post("http://localhost:5000/validProf", {
                fullCourseName : inputValue
              });

            console.log(response);
            alert((response.data>0)); // Or any other action
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
