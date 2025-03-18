import React, { useState } from 'react';

function ClassCards() {
    
    return (
        <div className = "shadow-md w-120 h-30 border border-black text-black text-lg pt-0 overflow-hidden flex flex-col bg-gray-200 hover:bg-gray-400">
            <div className = "header flex flex-row justify-between  p-6 pt-1 pb-0">
                <div>CSCI 313</div>
                <div>Shabir</div>
            </div>
            <div className = "border-b-1 border-gray-500 w-full h-1 "></div>
            <div className = "pl-6">Prof Rating: 3/3</div>
            <div className = "pl-6">Course Average X/4.0</div>
            <div className = "pl-6">Score 8/10</div>
            
        </div>
      );
      
}

export default ClassCards;
