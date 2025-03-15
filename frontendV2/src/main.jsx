import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/header.jsx';
import Schedule from './components/timegraph.jsx';
import SearchBar from './components/searchBar.jsx';
import ClassCards from './components/classCards.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='w-full min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-200 flex flex-col'>
      {/* Your content here */}
      <Header />
      <div className='body flex flex-row pt-20'>
      <div className="temp SearchBar w-1/2 h-full flex flex-col content-center items-center pt-5 pr-64 justify-items-stretch space-y-3">
        <SearchBar />
        <ClassCards />
      </div>


        <Schedule className = ""/>
      </div>
    </div>
  </StrictMode>
);
