import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header"; // Import your component
import "./index.css";
import TimeGraph from "./components/timeGraph"
import CourseSelection from './components/courseSelection'
// Select the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render MyApp into the root

root.render(<div className="background">
    <Header/>

    <div className = "body">
        <CourseSelection/>
        <TimeGraph/>
    </div>

</div>);
