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

app.get("/courses", (req, res) => {
  const userInput = req.query.search; // Expecting something like 'Math 101'
  
  const query = `
    SELECT * FROM courseschedule 
    WHERE CONCAT(course_name, ' ', course_code) = ?
  `;

  db.query(query, [userInput], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
});

app.get("/schedule", (req, res) => {
  const userInput = req.query.search; // Expecting something like ['Math 101', 'CSCI 313' ,...]
  
  
  
  res.json(results);
  }
);

app.post('/api/data', (req, res) => {
  const input = req.body.info; // Assuming input comes from request body
  console.log("RECEIVED: ", input);
  const sanitizedInput = `${input}%`; // Append `%` for partial match
  console.log(sanitizedInput);

  const query = `
      SELECT DISTINCT CONCAT(course_name, ' ', course_code) AS fullName
      FROM courseschedule
      WHERE CONCAT(course_name, ' ', course_code) LIKE ?;

  `;

  connection.query(query, [sanitizedInput], (err, results) => {
    if (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
        return;
    }
    res.json(results);
  });

  });

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");

});


function isConflict(schedule, course) {
    for (let scheduledCourse of schedule) {
        for (let time of scheduledCourse.times) {
            for (let newTime of course.times) {
                if (time === newTime) {
                    return true; // Conflict detected
                }
            }
        }
    }
    return false;
}

function backtrack(courses, index, schedule) {
    if (index === courses.length) {
        return schedule; // Successfully scheduled all courses
    }

    let courseOptions = courses[index];

    for (let option of courseOptions) {
        if (!isConflict(schedule, option)) {
            schedule.push(option);
            let result = backtrack(courses, index + 1, schedule);
            if (result) return result; // Found a valid schedule
            schedule.pop(); // Backtrack
        }
    }

    return null; // No valid schedule found
}
//work later
function getProfessors(courseOptions) {
  courseOptions = courseOptions.toString();
  console.log('testtt')
  console.log('COURSE OPTOINS ->', courseOptions)
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *  
      FROM courseschedule
      WHERE CONCAT(course_name, ' ', course_code) = ?;
    `;

    connection.query(query, [courseOptions], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        reject(err);
        return;
      }
      const newResults = results.filter(result => !result.section.includes("Winter"));
      resolve(newResults);
    });
  });
}

getProfessors("CSCI 313")
  .then((professors) => console.log(professors))
  .catch((error) => console.error("Error fetching professors:", error));



function scheduleCourses(courseOptions) {
    getProfessors(courseOptions)
    return backtrack(courseOptions, 0, []) || "No valid schedule found";
}


// Example Input: List of possible courses and their schedules
const courses = [
    [
        { name: "Math 101", instructor: "John Doe", days: "MoWe", times: ["11:00AM-1:00PM"] },
        { name: "Math 101", instructor: "John Doe", days: "TuTh", times: ["9:00AM-11:00AM"] }
    ],
    [
        { name: "CS 101", instructor: "Jane Smith", days: "MoWe", times: ["1:00PM-3:00PM"] },
        { name: "CS 101", instructor: "Jane Smith", days: "TuTh", times: ["11:00AM-1:00PM"] }
    ],
    [
        { name: "Physics 101", instructor: "Mike Brown", days: "MoWe", times: ["9:00AM-11:00AM"] },
        { name: "Physics 101", instructor: "Mike Brown", days: "TuTh", times: ["3:00PM-5:00PM"] }
    ]
];

console.log(scheduleCourses(courses));
