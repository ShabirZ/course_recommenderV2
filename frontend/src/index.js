import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header"; // Import your component
import "./index.css";
import TimeGraph from "./components/timeGraph"
import CourseSelection from './components/courseSelection'
import GenerateButton from "./components/generateCoursesButton";
// Select the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render MyApp into the root

root.render(<div className="background">
    <Header/>

    <div className = "body">
        <div className = "leftSide">
            <CourseSelection/>
            <GenerateButton/>
        </div>
        <TimeGraph/>
        
    </div>

</div>);
