import React, { useMemo } from 'react';

/*
const scheduleData = [
  // Early class (triggers expansion to 6 AM)
  { day: 'Monday', start: '06:00', end: '07:30', course: 'Early Bird Gym', color: 'bg-orange-500' },
  
  // Standard classes
  { day: 'Monday', start: '09:00', end: '11:30', course: 'Calculus I', color: 'bg-blue-500' },
  { day: 'Wednesday', start: '11:00', end: '12:00', course: 'Chemistry Lab', color: 'bg-green-500' },
  { day: 'Friday', start: '13:00', end: '16:00', course: 'History Seminar', color: 'bg-purple-500' },
  { day: 'Tuesday', start: '15:00', end: '16:00', course: 'Physics Lecture', color: 'bg-red-500' },
  
  // Late class (triggers expansion to 9 PM)
  { day: 'Thursday', start: '19:00', end: '20:30', course: 'Night Astronomy', color: 'bg-indigo-500' },
];
*/
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- Helper Functions ---

const timeToDecimal = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + (minutes / 60);
};

const formatTime = (time) => {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

/*

{ day: 'Monday', start: '09:00', end: '11:30', course: 'Calculus I', color: 'bg-blue-500' },
  { day: 'Wednesday', start: '11:00', end: '12:00', course: 'Chemistry Lab', color: 'bg-green-500' },
  { day: 'Friday', start: '13:00', end: '16:00', course: 'History Seminar', color: 'bg-purple-500' },
  { day: 'Tuesday', start: '15:00', end: '16:00', course: 'Physics Lecture', color: 'bg-red-500' },

*/
const CourseTable = ( props ) => {
  const { scheduleData = [] } = props;

  const HOUR_HEIGHT = 60; // Slightly compact height for better vertical fit

  // --- Dynamic Range Calculation ---
  const { startHour, endHour, timeSlots } = useMemo(() => {
    // defaults
    let earliest = 7;
    let latest = 19; // 7 PM
    if (scheduleData.length > 0) {
      // Find the absolute earliest start and latest end times in the data
      const startTimes = scheduleData.map(d => timeToDecimal(d.start));
      const endTimes = scheduleData.map(d => timeToDecimal(d.end));

      const minDataTime = Math.floor(Math.min(...startTimes));
      const maxDataTime = Math.ceil(Math.max(...endTimes));

      // Expand range if data goes outside 7-19
      if (minDataTime < earliest) earliest = minDataTime;
      if (maxDataTime > latest) latest = maxDataTime;
    }

    // Generate the array of hours for the grid rows
    const slots = [];
    for (let i = earliest; i <= latest; i++) {
      slots.push(i);
    }

    return { startHour: earliest, endHour: latest, timeSlots: slots };
  }, [scheduleData]);


  return (
    <div className="p-4 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Schedule</h2>
        <span className="text-sm text-gray-500">
          Range: {formatTime(`${startHour}:00`)} - {formatTime(`${endHour}:00`)}
        </span>
      </div>
      
      {/* Scrollable Container with Max Height */}
      <div className="overflow-y-auto max-h-[80vh] border border-gray-200 rounded-lg">
        <div className="grid grid-cols-[60px_repeat(7,_minmax(140px,_1fr))] min-w-full">
          
          {/* Header Row (Days) */}
          <div className="sticky top-0 z-20 bg-gray-100 border-r border-b border-gray-300"></div>
          {days.map(day => (
            <div 
              key={day} 
              className="sticky top-0 z-20 bg-gray-100 text-center font-bold p-2 border-b border-gray-300 text-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Time Rows */}
          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              
              {/* Time Label Column */}
              <div 
                className="text-xs text-right pr-2 -mt-2 border-r border-b border-gray-200 text-gray-500 relative bg-gray-50"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                <span className="relative -top-2 font-medium">
                  {formatTime(`${hour}:00`)}
                </span>
              </div>

              {/* Days Columns */}
              {days.map((day) => {
                // Filter events starting in this specific hour row
                const events = scheduleData.filter(event => {
                  const eventHour = parseInt(event.start.split(':')[0]);
                  return event.day === day && eventHour === hour;
                });

                return (
                  <div 
                    key={`${day}-${hour}`} 
                    className="relative border-r border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  >
                    {events.map((event, idx) => {
                      const startDecimal = timeToDecimal(event.start);
                      const endDecimal = timeToDecimal(event.end);
                      const duration = endDecimal - startDecimal;
                      
                      // Calculate offset (minutes)
                      const topOffset = (startDecimal % 1) * HOUR_HEIGHT;
                      const height = duration * HOUR_HEIGHT;

                      return (
                        <div
                          key={idx}
                          className={`absolute left-0 right-0 m-1 p-2 text-xs text-white rounded-md shadow-sm overflow-hidden ${event.color} hover:brightness-110 hover:shadow-md hover:scale-[1.02] transition-all z-10 cursor-pointer`}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                          }}
                          title={`${event.course} (${event.start} - ${event.end})`}
                        >
                          <p className="font-bold truncate">{event.course}</p>
                          <p className="truncate text-[10px] opacity-90">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseTable;