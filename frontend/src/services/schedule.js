// services/scheduleService.js

const API_BASE_URL = 'http://127.0.0.1:8000';


const dayMap = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday"
};

const colors = [ // bg Colors
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500"
];

const colorsText = [
  "bg-blue-50",
  "bg-green-50",
  "bg-purple-50",
  "bg-red-50",
  "bg-yellow-50"
]

function to24Hour(time) {
  const [t, period] = time.match(/\d+:\d+|AM|PM/g);
  let [hours, minutes] = t.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}


function transformSchedule(scheduleArray) {
  return scheduleArray.flatMap((item, index) => {
    const days = item.days.match(/Mo|Tu|We|Th|Fr/g);

    return days.map(dayCode => ({
      day: dayMap[dayCode],
      start: to24Hour(item.start_time),
      end: to24Hour(item.end_time),
      course: `${item.course_name} ${item.course_code}`,
      color: colors[index % colors.length],
      full_name :  `${item.first_name} ${item.last_name}`,
      section : item.section
    }));
  });
}

function getProfData(currSched, profData, colors, colorsText) {
  const courseCardData = [];
  for (let i = 0; i < currSched.length; i++) {
  
    const course = currSched[i];
    const course_name = `${course.course_name} ${course.course_code}`;
    const profName = `${course.first_name} ${course.last_name}`;
    const section = course.section;

    const profRating = profData[profName]?.rmp_rating ?? null;
    const profDifficulty = profData[profName]?.rmp_difficulty ?? null;
    const profCourseAvg = profData?.[profName]?.course_averages?.[course_name] ?? null;

    const score_gpa = (profCourseAvg / 4.0) * 100;
    const score_rating = (profRating / 5.0) * 100;
    const score_difficulty = ((5 - profDifficulty) / 4) * 100;

    const overallRating = (0.5 * score_gpa + 0.25 * score_rating + 0.25 * score_difficulty).toFixed(2);

    courseCardData.push({
      "className" : course.course_name,
      "classCode": course.course_code,
      profName,
      profRating,
      profDifficulty,
      profCourseAvg,
      overallRating,
      section
    });
    //colorText: colorsText[i % colorsText.length],
    //  fullBgClass: colors[i % colors.length],
    /*
      className = "CSCI";
      let classCode = "313";
      let hasProfData = false;
      let profName = "Shabir Zahir";
      let profCourseAvg = 3.7;
      let profRating = 4.8;
      let profDifficulty = 2.1;
      let colorText = "text-green-50"
      let overallRating = 95
      let fullBgClass = "bg-green-400";
      
    */
  }

  return courseCardData;
}

export const fetchSchedules = async (courses, semesterType, limit = 1, page = 1) => {
  console.log('test');
  try {
    const params = new URLSearchParams();
    courses.forEach(course => params.append('courses', course));
    
    // Append other single parameters
    params.append('section', semesterType);
    params.append('limit', limit.toString());
    params.append('page', page.toString());

    // 2. Combine base URL with the params
    const response = await fetch(`${API_BASE_URL}/generate_schedule?${params.toString()}`);
    
    if (!response.ok) {
      // Improved error handling to see what the server actually says
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Network response was not ok');
    }
    const data = await response.json();
    const currSched = data.schedules[0].schedule;
    const profCardData = getProfData(currSched, data.profData, colors, colorsText);

    console.log(profCardData);
    const schedData = transformSchedule(currSched)
    return {schedData, profCardData};

  } 
  catch (error) {
    console.error("Scheduling API Error:", error);
    throw error;
  }

};