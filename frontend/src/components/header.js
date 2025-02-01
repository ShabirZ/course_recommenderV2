import React from "react";
import { useState } from 'react';
import "../index.css";




export default function Header() {
  return (
    <div className="header">

      <div className = "discord">
        <p className = "social">Discord</p>
      </div>
      
      <div className = "linkedin"> 
        <p className = "social">Linkedin</p>
      </div>

    </div>
  );
  }
