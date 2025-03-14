import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/header.jsx';
import Schedule from './components/timegraph.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='w-full min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-200 flex flex-col'>
      {/* Your content here */}
      <Header />
      <div className='body flex flex-row'>
        <div className = "temp SearchBar w-1/2 h-full" />
        <Schedule />
      </div>
    </div>
  </StrictMode>
);
