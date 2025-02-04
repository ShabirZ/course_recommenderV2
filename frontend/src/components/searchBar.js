import React from "react";
import { useState, useRef, useEffect } from 'react';
import "./search.css";

function SearchCard(){
    const [isHovered,setHovered] = useState(false)
    const styles = {
        color: "black",
        height: "40px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        fontSize: "large",
        fontFamily: "Helvetica, sans-serif",
        backgroundColor: isHovered ? '#efefef' : "white",
        paddingTop: "5px",

    };

    //#efefef
    return <div className = "searchCard" style = {styles} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} > CSCI 313</div>
}
export default function SearchContainer() {
    
    const styles = {
        color: "red",
        backgroundColor: "black"
    };
    

    return (
        <div className = "searchContainer">
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>
            <SearchCard></SearchCard>

        </div>

    );
  }
    