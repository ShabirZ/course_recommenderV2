import { useState } from 'react';
import "../index.css";
import React from 'react';



export default function TimeGraph() {
  // Creating 5 columns (Mon-Fri) and 15 rows dynamically
    let days = ["monday", "tuesday", "wednesday","thursday","friday"];
    const columnsArray = [];
    let columns = 5;
    let rows = 14;
    for (let col_idx = 0; col_idx < columns; col_idx++) {
        let col_class = `col${col_idx} column`;
        const rowsArray = [];

    // Creating rows for each column
        for (let row_idx = 0; row_idx < rows; row_idx++) {
            let row_class = `row${row_idx} cell`;
            let top_class = `row${row_idx} top`;
            let bottom_class = `row${row_idx} bottom`;
            rowsArray.push(
            <div key={row_idx} className={`${row_class} h-8 border border-gray-700`}
            >
                <div className ={top_class}>top</div>
                <div className="divider"></div>
                <div className ={bottom_class}>bottom</div>
            </div>
            );
        }

        columnsArray.push(
            <div key={col_idx} className={col_class}>
            {rowsArray}
            </div>
        );
    }
    

  return (
    <div className="columns-container border-indigo-500">
      {columnsArray}
    </div>
  );
}
  