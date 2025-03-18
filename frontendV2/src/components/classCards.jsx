import React, { useState } from 'react';


function ClassCards({ className }) {
    return (
      <div className={`shadow-md w-120 h-30 border border-black text-black text-lg pt-0 overflow-hidden flex flex-col ${className}`}>
        <div className="header flex flex-row justify-between p-6 pt-1 pb-0">
          <div>CSCI 313</div>
          <div>Shabir</div>
        </div>
        <div className="border-b-1 border-gray-500 w-full h-1"></div>
        <div className="pl-6">Prof Rating: 3/3</div>
        <div className="pl-6">Course Average X/4.0</div>
        <div className="pl-6">Score 8/10</div>
      </div>
    );
  }
  

  function ClassCardList() {
    const backgrounds = [
        'bg-gradient-to-tl from-purple-800 via-purple-600 to-purple-400',
        'bg-gradient-to-tl from-green-800 via-green-600 to-green-400',
        'bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400',
        'bg-gradient-to-tl from-red-800 via-red-600 to-red-400',
        'bg-gradient-to-tl from-yellow-800 via-yellow-600 to-yellow-400',
        'bg-gradient-to-tl from-teal-800 via-teal-600 to-teal-400', // Teal gradient
        'bg-gradient-to-tl from-pink-800 via-pink-600 to-pink-400', // Pink gradient
        'bg-gradient-to-tl from-orange-800 via-orange-600 to-orange-400' // Orange gradient
      ];
  
    return (
      <div className="flex flex-col space-y-3">
        {backgrounds.map((bgClass, index) => (
          <ClassCards
            key={index}
            className={`${bgClass} transition-all duration-500 hover:opacity-40`}
          />
        ))}
      </div>
    );
  }
  
  export default ClassCardList;