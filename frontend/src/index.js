import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./header"; // Import your component
import "./index.css";
import TimeGraph from "./timeGraph"
import CourseSelection from './courseSelection'
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
