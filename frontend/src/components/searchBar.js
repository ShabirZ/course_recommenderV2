import React from "react";
import { useState, useRef, useEffect } from 'react';
import "./search.css";

function SearchCard({result, setInputValue}){
    const [isHovered,setHovered] = useState(false)
    const styles = {
        color: "black",
        width: "100%",
        display: "flex",
        alignItems: "center",
        fontSize: "large",
        fontFamily: "Helvetica, sans-serif",
        backgroundColor: isHovered ? '#efefef' : "white",
        paddingTop: "5px",

    };

    //#efefef
    return <div className = "searchCard" style = {styles} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseDown={() => setInputValue(result)}> {result}</div>
}
export default function SearchContainer({searchResults, setInputValue}) {
    console.log(searchResults);
    
    const styles = {
        color: "red",
        backgroundColor: "black"
    };
    

    return (
        <div className="searchContainer">
  {searchResults.length > 0 ? (
    searchResults.map((result, index) => {
      console.log("Rendering item:", result);  // Debugging
      return <SearchCard key={index} result={result} setInputValue={setInputValue}/>;
    })
  ) : (
    <p>No results found</p>
  )}
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
    