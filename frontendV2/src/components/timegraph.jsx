import React from "react";

function Schedule({ classesData }) {
  // Base days: always show Monday–Friday.
  const baseDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  // Potential weekend days.
  const weekendDays = ["Saturday", "Sunday"];
  // Add weekend days only if there is at least one class on that day.
  const extraDays = weekendDays.filter(day =>
    classesData.some(cls => cls.day === day)
  );
  // Final days order: Monday–Friday then weekend days if any.
  const days = [...baseDays, ...extraDays];

  const startHour = 7; // Schedule starts at 7:00 AM
  const endHour = 21;  // Schedule ends at 9:00 PM
  const cellHeight = 60; // Each hour cell is 60px tall

  // Convert a time string "HH:MM" to total minutes past midnight.
  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  // Format an hour for display (e.g., 13 becomes "1:00 PM").
  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="flex flex-col items-center p-4 mr-16">
      {/* Header Row */}
      <div className="flex">
        <div className="bg-black text-white p-2 w-32 border text-center">
          Time
        </div>
        {days.map((day) => (
          <div key={day} className="bg-black text-white p-2 w-32 border text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Schedule Grid Container */}
      <div
        className="relative border"
        style={{
          width: (days.length + 1) * 128, // each column is 128px wide (first column for time)
          height: (endHour - startHour) * cellHeight // total height based on hours
        }}
      >
        {/* Horizontal Hour Lines */}
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
          const currentHour = startHour + i;
          return (
            <div
              key={i}
              className="absolute left-0 w-full border-t border-gray-300"
              style={{ top: i * cellHeight }}
            >
              <span className="absolute left-2 text-xs text-gray-600">
                {formatHour(currentHour)}
              </span>
            </div>
          );
        })}

        {/* Vertical Lines for Day Columns */}
        {days.map((day, dayIndex) => (
          <div
            key={day}
            className="absolute top-0 border-l border-gray-300"
            style={{ left: (dayIndex + 1) * 128 }}
          />
        ))}

        {/* Render Class Overlays */}
        {classesData.map((cls, index) => {
          const dayIndex = days.indexOf(cls.day);
          // If a class is on a day that is not in our days array, we skip it.
          if (dayIndex === -1) return null;

          const startMins = timeToMinutes(cls.startTime);
          const endMins = timeToMinutes(cls.endTime);
          // Calculate offset (minutes from 7:00 AM) and duration.
          const offset = startMins - startHour * 60;
          const duration = endMins - startMins;
          return (
            <div
              key={index}
              className={`absolute ${cls.bgColor} text-white text-sm flex items-center justify-center rounded border p-1`}
              style={{
                top: `${(offset / 60) * cellHeight}px`,
                height: `${(duration / 60) * cellHeight}px`,
                left: `${(dayIndex + 1) * 128}px`,
                width: "128px"
              }}
            >
              {cls.className}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Schedule;
