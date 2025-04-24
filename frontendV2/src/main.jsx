import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/header.jsx';
import Schedule from './components/timegraph.jsx';
import SearchBar from './components/searchBar.jsx';
import ClassCards from './components/classCards.jsx';
import ClassCardList from './components/classCards.jsx';
import axios from 'axios';

async function generateSchedule(sampleClasses) {
  //const courseNames = sampleClasses.map(course => course.className);
  const courseNames = ['CSCI 313', 'CSCI 320'];
  const response = await axios.post("http://localhost:5000/scheduleCreate", {
    courseNames
  });
  return response.data;
}

const sampleClasses = [
  {
    className: "CSCI 313",
    day: "Monday",
    startTime: "13:10",
    endTime: "14:40",
    bgColor: "bg-red-500"
  },
  {
    className: "CSCI 313",
    day: "Wednesday",
    startTime: "13:10",
    endTime: "14:40",
    bgColor: "bg-red-500"
  },
  {
    className: "MATH 220",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:30",
    bgColor: "bg-blue-500"
  },
  {
    className: "ENG 101",
    day: "Friday",
    startTime: "11:15",
    endTime: "12:45",
    bgColor: "bg-green-500"
  },
  {
    className: "BIO 101",
    day: "Saturday",
    startTime: "08:30",
    endTime: "10:00",
    bgColor: "bg-purple-500"
  }
];

// Then render:
<Schedule classesData={sampleClasses} />

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <div className='w-full min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-200 flex flex-col'>
      {/* Your content here */}
      <Header />
      <div className='body flex flex-row pt-20'>
        <div className="temp SearchBar w-1/2 h-full flex flex-col content-center items-center pt-5 pr-64 justify-items-stretch space-y-3">
          
          <SearchBar />
          <ClassCardList sampleClasses = {sampleClasses}/>
          
          <button className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          onClick={generateSchedule(sampleClasses)}
          >
            Generate Schedule
          </button>

        </div>

        <div className = "rightSide">
          <Schedule className = "" classesData={sampleClasses}></Schedule>

        </div>
      </div>
    </div>
  </StrictMode>
);
