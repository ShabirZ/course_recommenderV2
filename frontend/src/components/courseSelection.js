import React from "react";
import { useState, useRef } from 'react';
import "../index.css";

function ClassCard(){
    let course = "CSCI";
    let courseNumber = "313";
    let prof = "Shabir Zahir";
    let rating = "5.0 / 5";
    let difficulty = "5.0 / 5";
    let average = "3.2 / 4";
    let styles = {
        color: "red",
        backgroundColor: 'red'
    };
    return (
        <div className="classCard">
            <div className="test" > {course}  </div>
            <div className="test"> {courseNumber}  </div>
            <div className="test"> {prof}  </div>
            <div className="test"> {rating}   </div>
            <div className="test"> {difficulty}  </div>
            <div className="test"> {average}  </div>
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
        }
        else{
            setValidResult(<InvalidInput/>);
        }
        
    };
    let info;
    let text;
    const timeOutCountRef = useRef(0);
    const [courses, updateCouses] = useState([]);
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
            
            {validResult}
            <ClassCard/>
        </div>
      );
}