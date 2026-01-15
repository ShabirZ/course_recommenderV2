import React, { useEffect, useState } from 'react';

const CourseDetailMode = ({ modelDetails, setModelFlag }) => {
  const {
    profName,
    profCourseAvg,
    profRating,
    profDifficulty,
    overallRating,
    className,
    classCode,
    section
  } = modelDetails;

  // State to trigger animation on mount
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setModelFlag(false), 200); // Wait for animation
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : '??';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop with Blur and Fade */}
      <div 
        className={`absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-stone-100 overflow-hidden transform transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-start gap-5 mb-8">
            {/* Avatar Circle */}
            <div className="h-16 w-16 flex-shrink-0 rounded-full bg-stone-100 flex items-center justify-center border-2 border-white shadow-md text-stone-600 font-bold text-xl tracking-wider">
              {getInitials(profName)}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-stone-800 leading-tight mb-1">
                {profName}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 tracking-wide uppercase">
                  {classCode}
                </span>
                <span className="text-stone-500 text-sm font-medium">
                  {className}
                </span>
                <span className="text-stone-400 text-xs">•</span>
                <span className="text-stone-500 text-sm">
                  Section {section}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Rating Card */}
            <StatCard 
              label="Prof Rating" 
              value={`${profRating} / 5`} 
              subtext="Student Reviews"
              icon={
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
            />

            {/* Difficulty Card */}
            <StatCard 
              label="Difficulty" 
              value={`${profDifficulty} / 5`} 
              subtext="Complexity Level"
              icon={
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            {/* Course Avg Card */}
            <StatCard 
              label="Avg GPA" 
              value={`${profCourseAvg}`} 
              subtext="Class Performance"
              icon={
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />

            {/* Overall Card - Highlighted */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-indigo-100 rounded-md">
                   <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Overall Score</p>
              </div>
              <p className="text-2xl font-bold text-stone-800 mt-1">{overallRating}</p>
              <p className="text-xs text-indigo-400 mt-1">Weighted Rating</p>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-8">
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for cleaner code
const StatCard = ({ label, value, subtext, icon }) => (
  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</p>
      {icon}
    </div>
    <p className="text-xl font-bold text-stone-800">{value}</p>
    <p className="text-[10px] text-stone-400 mt-1">{subtext}</p>
  </div>
);

export default CourseDetailMode;