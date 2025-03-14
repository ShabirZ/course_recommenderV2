import React, { useState } from 'react';

function Schedule() {
    const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const rows = []
    
    // Initialize the gridState to track the state of each cell
    // Each cell starts with false (not booked).
    const [gridState, setGridState] = useState(
        Array.from({ length: 14 }, () => Array(days.length).fill(false)) // 14 time slots, 6 days (including the empty header)
    );

    // Function to toggle cell state (booked or free)
    const toggleCell = (rowIdx, colIdx) => {
        const newGridState = [...gridState];
        newGridState[rowIdx][colIdx] = !newGridState[rowIdx][colIdx]; // Toggle between booked (true) and free (false)
        console.log(rowIdx, colIdx);
        setGridState(newGridState);
    };

    // First, create header row (days of the week)
    let cols = [];
    for (const element of days) {
        cols.push(
            <div key={element} className="bg-black text-white p-2 w-32 border-1 text-center">
                {element}
            </div>
        );
    }
    rows.push(<div key="header" className="flex">{cols}</div>); // Add header row

    // Then, create time slot rows (7AM - 8PM)
    for (let i = 7; i < 21; i++) {
        cols = [];
        let timeDay = "am";
        let hours = i;
        if (i >= 12) {
            timeDay = "pm";
        }
        if (i > 12) {
            hours = i - 12;
        }
        const time = hours + ":00 " + timeDay;

        // Loop through each day and create a cell for each time slot
        for (let j = 0; j < days.length; j++) {
            const isBooked = gridState[i - 7][j]; // Get the state of the current cell (booked or free)
            cols.push(
                <div
                    key={time + "-" + j}
                    className={`p-2 w-32 border text-center cursor-pointer ${
                        j === 0 ? "bg-black text-white" : isBooked ? "bg-green-500" : "bg-red-500"
                    }`}                
                    onMouseDown={j !== 0 ? () => toggleCell(i - 7, j) : undefined}
                    style={{ userSelect: "none" }}
                >
                    {j === 0 ? time : ""} {/* Display time only in the first column */}
                </div>
            );
        }
        rows.push(<div key={time} className="flex">{cols}</div>); // Add row for this time slot
    }

    // Render the grid
    return (
        <div className="flex flex-col items-center p-4">
            {rows}
        </div>
    );
}

export default Schedule;
