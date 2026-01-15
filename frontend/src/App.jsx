import { useState } from 'react';
import Header from "./components/Header";
import CourseTable from "./components/CourseTable"
import SearchBar from "./components/SearchBar"
import CourseCard from "./components/CourseCard"
import SchedulerButton from './components/SchedulerButton';
import { fetchSchedules } from "./services/schedule";
import CourseDetailModel from "./components/CourseDetailModel";
import './App.css'

/*
@app.get("/generate_schedule/")  # Changed to .get
def generate_schedule(
    courses: List[str] = Query(...),
    section: str = Query(...) 
):
*/
// (courses, semesterType, limit = 1, page = 1
function App() {
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState(['CSCI 313', 'CSCI 320']);
  const [semesterType, setSemesterType] = useState("Regular");
  const [schedulePage, setSchedulePage] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [showCardData, setShowCardData] = useState(false);
  const [modelDetails, setModelDetails] = useState({});
  const [modelFlag, setModelFlag] = useState(false);
  /*
  const courseCards = courses.map(course => {
    return <CourseCard key={course} course={course} showCard = {showCardData} />;
  });
  */
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


  const courseCards = courses.map((course, index) => {
    const card = cardData.find(c => `${c.className} ${c.classCode}` === course);
    const colorText = colorsText[index % colorsText.length];
    const fullBgClass = colors[index % colors.length]
    return <CourseCard 
      key={course} course={course} card={card} 
      hasProfData={showCardData} colorText = {colorText} 
      fullBgClass = {fullBgClass} setModelFlag = {setModelFlag}
      setModelDetails = {setModelDetails}
      />;
  });

  return (
    <div className = "w-screen flex flex-col bg-stone-300 items-center">
      <Header/>
      <div className = "flex h-full w-full px-10 py-10 items-around justify-around gap-3 border">
        <div className = "flex flex-col gap-4"> 
          <SearchBar searchText = {searchText} setSearchText = {setSearchText} setCourses = {setCourses} courses = {courses}/>
          {courseCards}
          <div className='flex'>
            <SchedulerButton 
            fetchSchedules = {fetchSchedules} courses = {courses} 
            semesterType = {semesterType} schedulePage = {schedulePage} 
            setCourseData = {setCourseData} setShowCardData = {setShowCardData}
            setCardData = {setCardData}
            />

            <button 
            className="bg-stone-700 text-red-300 flex-1 ml-7 hover:text-red-800 hover:bg-stone-900"
            onClick = {() => {
              setCourses([]);
              setShowCardData(false);
            }}
            > Reset </button>
          </div>
        <select
              id="semester"
              className="bg-stone-700 rounded-md py-2 px-2 text-center text-white pr-8"
              value={semesterType}
              onChange={(e) => setSemesterType(e.target.value)}
            >
              <option value="Winter">Winter</option>
              <option value="Regular">Regular</option>
            </select>
        </div>
        <CourseTable scheduleData = {courseData}/>
        {modelFlag && <CourseDetailModel setModelFlag = {setModelFlag} modelDetails = {modelDetails}/>}
      </div>
    </div>  
  )
}

export default App
