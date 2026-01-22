import { useState } from "react";

const SearchBar = ( props ) => {
    const { searchText , setSearchText, setCourses, courses} = props;
    const [validationTextState, setValidationState] =  useState("");

    const showTempValidation = (state) => {
        setValidationState(state);
        setTimeout(() => setValidationState(""), 1000);
    };
    const checkCourse = async (courseQuery) => {
        const response = await fetch(
        `http://localhost:8000/course_exists?course_query=${courseQuery}`
        );
        if(validationTextState != ""){
            return;
        }
        const data = await response.json();
        console.log(data);
        const normalizedQuery = courseQuery.toUpperCase();

        const validQuery = data["valid input"] == true
        const duplicateQuery = courses.includes(normalizedQuery);

        // text state to tell user if text valid
        if (validQuery && !duplicateQuery){
            const updatedCourses = [...courses, courseQuery];

            setCourses(updatedCourses);
            setSearchText("");
            showTempValidation("valid");
        }
        else if(validQuery && duplicateQuery){
            showTempValidation("duplicate");
        }
        else{
            showTempValidation("invalid");
        }
        
        
        
    };
    return (
        <form
        className="flex flex-col gap-2" // make it vertical
        onSubmit={(e) => {
            e.preventDefault();
            checkCourse(searchText);
        }}
        >
        <div className="flex justify-between">
            <input
            className="bg-white text-neutral-700 rounded-lg shadow-md py-2 px-2 flex-1"
            placeholder="Enter Class"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
            <button
            className="border-2 border-blue-200 bg-blue-300 rounded-lg ml-4 hover:bg-blue-700"
            type="submit"
            >
            Submit
            </button>
        </div>

        {/* Validation message */}
        {validationTextState === "valid" && (
            <p className="text-green-500 text-lg text-strong">Course added!</p>
        )}
        {validationTextState === "duplicate" && (
            <p className="text-red-500 text-lg text-strong">Course already added!</p>
        )}
        {validationTextState === "invalid" && (
            <p className="text-red-500 text-lg text-strong">Invalid course format!</p>
        )}
        </form>
    );
};
export default SearchBar;