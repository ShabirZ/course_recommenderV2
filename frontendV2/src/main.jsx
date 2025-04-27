import React, { StrictMode, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/header.jsx';
import Schedule from './components/timegraph.jsx';
import SearchBar from './components/searchBar.jsx';
import ClassCardList from './components/classCards.jsx';
import axios from 'axios';

// helper to convert “3:10PM” → “15:10”
function to24h(time12h) {
  let [time, suffix] = [time12h.slice(0, -2), time12h.slice(-2)];
  let [h, m] = time.split(':').map(Number);
  if (suffix === 'PM' && h !== 12) h += 12;
  if (suffix === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// map MoTuWe… → full day names
const dayMap = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday',
  Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday'
};
function expandDays(abbrev) {
  const days = [];
  for (let i = 0; i < abbrev.length;) {
    const two = abbrev.slice(i, i + 2);
    if (dayMap[two]) { days.push(dayMap[two]); i += 2; }
    else i++;
  }
  return days;
}

function App() {
  // Declare state before using it in callbacks
  const [sampleClasses, setSampleClasses] = useState([
    { className: 'CSCI 313', day: 'Monday',    startTime: '13:10', endTime: '14:40', bgColor: 'bg-red-500' },
    { className: 'CSCI 313', day: 'Wednesday', startTime: '13:10', endTime: '14:40', bgColor: 'bg-red-500' },
    { className: 'MATH 220', day: 'Wednesday', startTime: '09:00', endTime: '10:30', bgColor: 'bg-blue-500' },
    { className: 'ENG 101',  day: 'Friday',    startTime: '11:15', endTime: '12:45', bgColor: 'bg-green-500' },
    { className: 'BIO 101',  day: 'Saturday',  startTime: '08:30', endTime: '10:00', bgColor: 'bg-purple-500' }
  ]);
  const courseBgColors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-amber-400',
    'bg-lime-400',
    'bg-teal-700',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600'
  ];
  // Define callback after state initialization
  const generateSchedule = useCallback(async () => {
    // GENERATE COURSES ["CSCI 313", "CSCI 320"]
    try {
      const courseNames = ["CSCI 320", "CSCI 343"]
      const { data } = await axios.post(
        'http://localhost:5000/scheduleCreate',
        { courseNames }
      );
      const profs = data.schedule || data.bestSchedule?.schedule || [];
      let idx = -1;
      const events = profs.flatMap(prof => {
        idx++;
        const days = expandDays(prof.days);
        return days.map(day => ({
          className: `${prof.classSubject} ${prof.classCode}`,
          day,
          startTime: to24h(prof.startTime),
          endTime: to24h(prof.endTime),
          bgColor: courseBgColors[idx]
        }));
      });

      setSampleClasses(events);
      console.log('Updated sampleClasses:', events);
    } catch (err) {
      console.error('Error generating schedule:', err);
    }
  }, [sampleClasses]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-200 flex flex-col'>
      <Header />
      <div className='body flex flex-row pt-20'>
        <div className='w-1/2 h-full flex flex-col items-center pt-5 pr-64 space-y-3'>
          <SearchBar />
          <ClassCardList sampleClasses={sampleClasses} />
          <button
            className='px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            onClick={generateSchedule}
          >
            Generate Schedule
          </button>
        </div>
        <div className='flex-1'>
          <Schedule classesData={sampleClasses} />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
