import React from "react";
import { useState } from 'react';
import "../index.css";



export default function CourseSelection(){
    const sharedInputStyle = {
        fontSize: '20px',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)'
    };
    const invalidInputStyle{
        
    }
    const ValidInput = ()=> <p style = {sharedInputStyle}> valid Password</p>
    const InvalidInput = () => <p style = {sharedInputStyle}> invalid Password </p>
    function handlerFuntion (inputValue){
        
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
        </div>
      );
}