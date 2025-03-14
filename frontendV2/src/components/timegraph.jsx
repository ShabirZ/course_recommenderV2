import React, { useState } from 'react';


function Schedule() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const rows = []
    const cols = [];
    
    for (const element of days) {
      cols.push(<div key={element} className="bg-black text-white p-2 w-32 border-2 text-center">{element}</div>);
    }
    rows.push(cols);
    return   (
        <div className="flex justify-center w-1/2 h-full p-16">
            {rows}
        </div>
    )
};

export default Schedule;
