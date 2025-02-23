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

app.get("/schedule", async (req, res) => {
  const userInput = req.query.search; // Expecting an array like ['Math 101', 'CSCI 313']
  
  let courseProfessors = [];

  try {
    // Process all courses asynchronously
    const professorPromises = userInput.map(async (currentClass) => {
      let currentProfArr = [];

      try {
        const professors = await getProfessors(currentClass);
        console.log(professors);

        professors.forEach((profObj) => {
          // Extract properties from professor object
          let currentProf = new Prof(
            profObj.first_name, 
            profObj.last_name, 
            profObj.course_name,  // Fixed syntax issue
            profObj.course_code, 
            profObj.start_time, 
            profObj.end_time, 
            profObj.section
          );

          currentProfArr.push(currentProf);
        });
      } catch (error) {
        console.error(`Error fetching professors for ${currentClass}:`, error);
      }

      return currentProfArr;
    });

    // Wait for all course professor lists to resolve
    courseProfessors = await Promise.all(professorPromises);
    
    res.json(courseProfessors);
  } catch (error) {
    console.error("Error handling schedule request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


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
  .then((professors) => {
    console.log(professors);
    professors.forEach((profObj) => {
      //firstName, lastName, classSubject, classCode, startTime, endTime, section
      
      console.log(profObj.course_code);
    });
  })
  .catch((error) => console.error("Error fetching professors:", error));
