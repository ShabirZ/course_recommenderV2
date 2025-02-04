import React from "react";
import { useState, useRef, useEffect } from 'react';
import "../index.css";
import SearchContainer from "./searchBar";


function ClassCard({courseName, onRemove}){

    function test(){
        console.log('1');
        onRemove(courseName);
    }
    let courseNumber = "313";
    let prof = "Shabir Zahir";
    let rating = "5.0 / 5";
    let difficulty = "5.0 / 5";
    let average = "3.2 / 4";
    
    const styles = {
        color: "white",
        font: "Libre Franklin",
        marginRight: "10px",
        padding: "5px",


        textShadow: "0 0 5px white, 0 0 10px white, 0 0 20px rgba(255, 255, 255, 0.8)"
    };

    const object = {
        display: "flex",
        width:"100%",
        flexDirection: "row",
        padding: "0px",
        justifyContent: "space-between",
        
    };
    const divider ={
        width:"101%",
        color: "white",
        height: "2%",
        backgroundColor: "solid blue",
        border: "1px solid white",
    };

    
    
    return (
        <div className="classCard" onClick={() => test() }> {/*(onRemove(courseName)}>*/}
            <div className = "courseName" style = {{ ...styles, ...object }}>
            
                <div style = {styles} > {courseName}   </div>
                {/*<div style = {styles}> {courseNumber}  </div>*/}
                <div style = {styles} className ="left-align"> {prof}  </div>
            </div>

            <div style={divider}></div>

            <div className = "ratings" style = {styles}>
                <div className = "courseRatings">
                    <div style = {styles}> RMP Score: {(parseFloat(rating) + parseFloat(difficulty))}   </div>
                    <div style = {styles}> Course Average: {parseFloat(average)*2.5}  </div>
                </div>
                <div className="profScore" style={styles}>
                    Final Score: {parseFloat((parseFloat(rating) + parseFloat(difficulty) + parseFloat(average) * 2.5) / 2)}
                </div>
            </div>
        </div>
    
    )};




export default function CourseSelection(){
    const sharedInputStyle = {
        fontSize: '20px',
        paddingTop: '20px',
    };
    const invalidInputStyle = {
        color: '#FF3131',        
    };
    const validInputStyle = {
        color: '#39FF14',

    };
    const ValidInput = ()=> <p style = {{ ...sharedInputStyle, ...validInputStyle }}> Valid Password</p>
    const InvalidInput = () => <p style = {{...sharedInputStyle, ...invalidInputStyle}}> Invalid Password </p>
    
    const [coursesSelected, setCourse] = useState([]);

    const addCourse = (courseName) =>setCourse([...coursesSelected,courseName]);
    const removeCourse = (courseName) => setCourse(prevCourses => prevCourses.filter(course => course !== courseName));


    function handlerFuntion (inputValue){
        timeOutCountRef.current++;
        const currTimeOut = timeOutCountRef.current;
        
        setTimeout(() => {
            if (currTimeOut == timeOutCountRef.current){
                setValidResult(null);
              }
            }, 1000);
        const regex = /^[a-zA-Z]{3,5} \d{3,5}[a-zA-Z]?$/;
        if(regex.test(inputValue)){
            setValidResult(<ValidInput/>);
            addCourse(inputValue);
            return true;

        }
        setValidResult(<InvalidInput/>);
        return false;
        
    };
    let info;
    let text;
    const timeOutCountRef = useRef(0);
    const [courses, setCourses] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [validResult, setValidResult] = useState(null);
    return (
        <div className = 'courseBody'>
            <input className = 'classSearch' placeholder="CSCI 313" value={inputValue} 
                onInput={e => setInputValue(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                        handlerFuntion(inputValue);
                    }} />
            <SearchContainer/>
            {validResult}

            <div className = "courseList">
                {coursesSelected.map((course) => (
                        <ClassCard key={course} courseName={course} onRemove={removeCourse} />
                    ))}
            </div>;
        </div>
      );
}