import React from "react";
import { useState, useRef, useEffect } from 'react';
import "./search.css";

function SearchCard({result}){
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
    return <div className = "searchCard" style = {styles} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} > {result}</div>
}
export default function SearchContainer({searchResults}) {
    
    const styles = {
        color: "red",
        backgroundColor: "black"
    };
    

    return (
        <div className="searchContainer">
            {searchResults.map((result, index) => (
            <SearchCard key={index} result={result} />
            ))}
        </div>

        /*
        <div className = "searchContainer">
            for (result in searchResults){
                create <searchCard result = {result}>
            }
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
        */
    );
  }
    