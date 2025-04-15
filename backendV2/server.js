import { scheduleCourses } from './scheduler.js';

const Prof = require('./prof'); // Using require for Prof class

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); // Enables CORS for all routes
app.use(express.json()); // Allows JSON request bodies
const mysql = require('mysql2');
require('dotenv').config(); // Load the .env file

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });
connection.connect();

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server! 🚀");
});

//test this
async function findProfStats(first_name, last_name) {
  const query = `
    SELECT prof_rating, prof_difficulty
    FROM rmp_score
    WHERE first_name = ? AND last_name = ?
  `;
  // Create an array for the query parameters
  const queryParams = [first_name, last_name];

  try {
    const profData = await new Promise((resolve, reject) => {
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    // Check if the returned result has the expected length.
    // If it does not, return a default value.
    if (profData.length !== 2) {
      return [-1, -1];
    }

    return profData;
  } catch (error) {
    console.error('Error retrieving professor stats:', error);
    throw error;
  }
}


app.post("/scheduleCreate", async (req, res) => {
    const courses = req.body.courseNames;
  
    const query = `
      SELECT * 
      FROM courseschedule
      WHERE CONCAT(course_name, ' ', course_code) = ?
    `;
  
    try {
      let profList = [];
  
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
  
        const profRows = await new Promise((resolve, reject) => {
          connection.query(query, [course], (err, results) => {
            if (err) {
              return reject(err);
            } else {
              resolve(results);
            }
          });
        });
        const newResults = profRows.filter(profRows => !profRows.section.includes("Winter"));
        
  
        for (let j = 0; j < newResults.length; j++) {
          const profObj = newResults[j];
          
          const currProf = new Prof(
            profObj.first_name,
            profObj.last_name,
            profObj.course_name,
            profObj.course_code,
            profObj.start_time,
            profObj.end_time,
            profObj.section
          );
          let profFirstName = profObj.first_name;
          let profLastName = profObj.last_name;
          
          let rmp_rating;
          let rmp_difficulty;

          findProfStats(profFirstName, profLastName);
          profList.push(currProf);
        }
        
      }
  
      //return res.status(200).json({ professors: profList });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }

    //make class that does this to make cleaner
    allSchedules = scheduleCourses(profList);
  });
  
app.post("/validProf", async (req, res) => {
    const fullCourseName = req.body.fullCourseName; // Access query parameter from the request
    console.log(fullCourseName);

    if (!fullCourseName) {
        return res.status(400).json({ error: "fullCourseName is required" });
    }

    const query = `
    SELECT COUNT(*) AS count
    FROM courseschedule
    WHERE CONCAT(course_name, ' ', course_code) = ?
    `;

    // Wrap the query in a Promise to use async/await
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [fullCourseName], (err, results) => {
                if (err) {
                    reject(err); // Reject if there is a database error
                } else {
                    resolve(results); // Resolve if the query is successful
                }
            });
        });

        console.log(results); // Log the result to inspect it
        console.log(results[0]['count']); // Log the count value

        // Send the response after the query is completed
        res.json(results[0]['count'] );
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");

});