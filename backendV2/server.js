import { scheduleCourses } from './scheduler.js';
import Prof from './prof.js';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors()); // Enables CORS for all routes
app.use(express.json()); // Allows JSON request bodies


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

async function findProfAvg(firstName, lastName,courseName, courseCode){
  const query = `
    SELECT Average, Term
    FROM prof_grade_avg
    WHERE prof = ? AND course = ? AND \`Course Number\` = ?
  `;
  lastName = lastName.toUpperCase();
  firstName = firstName.toUpperCase();
  let profQueryName = lastName + ' ' + firstName[0];

  const queryParams = [profQueryName, courseName, parseInt(courseCode)];
  try {
    const profAverages = await new Promise((resolve, reject) => {
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    // Check if professor DID NOT teach any classes before
    if(profAverages.length==0) return 2.75;

    // take average
    let total  = 0;
    for(let i=0; i< profAverages.length; i++){
      total+=parseFloat(profAverages[i]["Average"]);

    }
    return (total/ profAverages.length).toFixed(2);
  } catch (error) {
    console.error('Error retrieving professor stats:', error);
    throw error;
  }
}

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
    if(profData.length!==1) return [-1,-1]
    
    return [profData[0].prof_rating,profData[0].prof_difficulty];
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
    let profList = [];
    try {
      
  
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
        
        let classRow = []
        for (let j = 0; j < newResults.length; j++) {
          const profObj = newResults[j];
          
          const currProf = new Prof(
            profObj.first_name,
            profObj.last_name,
            profObj.course_name,
            profObj.course_code,
            profObj.start_time,
            profObj.end_time,
            profObj.section,
            profObj.days
          );
          let profFirstName = profObj.first_name;
          let profLastName = profObj.last_name;
          

          const [rmp_rating, rmp_difficulty] = await findProfStats(profFirstName, profLastName);
          const profCourseAvg = await findProfAvg(profFirstName, profLastName, profObj.course_name, profObj.course_code);

          currProf.setCourseAverage(profCourseAvg);
          currProf.setRMP(rmp_rating, rmp_difficulty);
          classRow.push(currProf);

        


        }
        profList.push(classRow);
        
      }
  
      //return res.status(200).json({ professors: profList });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }

    //make class that does this to make cleaner
    //const { allSchedules, bestSchedule } = scheduleCourses(profList);    
    console.log('RUNNING SCHEDULER:');
    console.log(profList);
    let a,b;
    let {allSchedules, bestSchedule} = scheduleCourses(profList);

    
    console.log('BEST');
    
    console.log(bestSchedule.score)
    for (let prof of bestSchedule.schedule) {
      console.log(`${prof.firstName} ${prof.lastName} - ${prof.classSubject} ${prof.classCode}`);
    }
    
  
    
    for(let idx=0; idx < allSchedules.length; idx++){
      console.log(allSchedules[idx])
      for(let j=0; j< allSchedules[idx].length; j++){

      
      console.log(allSchedules[idx][j].firstName);
      }
    }
    

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