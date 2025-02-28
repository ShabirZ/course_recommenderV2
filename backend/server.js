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

  connection.query(query, [userInput], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
});

function searchProfCourseAvg(courseName, courseCode, firstName, lastName) {
  return new Promise((resolve, reject) => {
    const fullName = lastName + " " + firstName[0];
    const query = `
      SELECT AVERAGE, TERM
      FROM prof_grade_avg
      WHERE prof = ? AND course = ? AND  \`Course Number\` = ?;
    `;
    const values = [fullName, courseName, parseInt(courseCode)];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return reject(err); // Reject the Promise on error
      }

      let average = 0.0;
      let term_count = results.length;

      results.forEach((row) => {
        average += row.AVERAGE;
      });

      if (term_count > 0) {
        average /= term_count;
      }

      resolve(average); // Resolve with the calculated average
    });
  });
}

/*
function searchProfCourseAvg(courseName, courseCode, firstName, lastName, callback) {
  // Format professor name: "Waxman J"
  let fullName = lastName + " " + firstName[0];

  const query = `
    SELECT AVERAGE, TERM
    FROM prof_grade_avg
    WHERE prof = ? AND course = ? AND Course Number = ?;
  `;

  const values = [fullName, courseName, parseInt(courseCode)];
  let average = 0.0;
  let term_count = 0
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return callback(err, null); // Return error via callback
    }
    results.forEach((row) => {
      // Extract properties from professor object
      average+=row.currAverage;
      term_count++;
    });

    if(term_count ==0){
      callback(null, 0);
    }
    average = average / term_count
    callback(null, average); // Return results via callback
  });
}
*/

function searchProfRMP(first_name, last_name){
    return new Promise((resolve, reject) => {
      const query = `
        SELECT prof_rating, prof_difficulty 
        FROM rmp_score 
        WHERE first_name = ? AND last_name = ?
      `;
  
      connection.query(query, [first_name, last_name], (err, results) => {
        if (err) {
          console.error("Error with RMP DB request:", err);
          reject(err); // Reject the Promise on error
          return;
        }
  
        if (results.length > 0 && results[0].prof_rating !== undefined) {
          resolve([results[0].prof_rating, results[0].prof_difficulty]);
        } else {
          resolve(null); // If no results found, return null
        }
      });
    });
  }

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
          searchProfCourseAvg(course_name, course_code, first_name, last_name, (err, average) => {
            currentProf.setCourseAverage(-1);
            if (!err) {
              console.log(average);
              currentProf.setCourseAverage(average);
            }
          });
          console.log(`${currentProf.firstName} ${currentProf.lastName} ${currentProf.courseAverage}`);

          


          console.log(searchProfRMP(first_name, last_name));
          currentProfArr.push(currentProf);
        });
      }
       catch (error) {
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
      console.log('STARTTT');
      
      searchProfCourseAvg(profObj.course_name, profObj.course_code, profObj.first_name, profObj.last_name)
        .then((average) => {
          currentProf.setCourseAverage(average || 0);
          console.log(average);
          console.log(`${currentProf.firstName} ${currentProf.lastName} ${currentProf.courseAverage}`);
          // Second
        })
        .catch((err) => {
          console.error("Error fetching course average:", err);
        });

        searchProfRMP(profObj.first_name, profObj.last_name)
        .then((result) => {
          profObj.prof_rating = result[0];
          profObj.prof_difficulty = result[1];
          console.log(profObj.prof_rating,'aaa')
        })

        .catch((err) => {
          console.error("Error:", err);
        });
              //rating, prof_difficulty = searchProfRMP(first_name, last_name);
        //profObj.rating = rating;
        //profObj.prof_difficulty = prof_difficulty;
        // First
        //console.log(`${currentProf.firstName} ${currentProf.lastName} ${currentProf.courseAverage} ${profObj.rating} ${profObj.prof_difficulty}`);


      //});
    /*
    professors.forEach((profObj) => {
      //firstName, lastName, classSubject, classCode, startTime, endTime, section
     
      console.log(profObj.course_code);

      first_name = profObj.first_name;
      last_name = profObj.last_name;
      const query = `
            SELECT prof_rating, prof_difficulty
            FROM RMP_score 
            WHERE CONCAT(first_name, ' ', last_name) = ?
          `

      
      const professors =  getProfessors(currentClass);
      
      */

          





    });
  })
  .catch((error) => console.error("Error fetching professors:", error));
