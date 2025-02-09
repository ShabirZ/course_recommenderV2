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
    console.log(results)
    res.json(results);
  });
  /*
  const regex = /^[a-zA-Z]{0,5}( ?\d{0,5}[a-zA-Z]?)?$/;

  connection.query("SELECT DISTINCT course_name, course_code FROM courseschedule WHERE CONCAT(course_name,' ',course_code) LIKE INPUT {req}", (err, results) => {
  if (err) {
    console.error('Error:', err);
    res.status(500).send('Database query error');
  } else {
    console.log(results);
    //res.json(results); // Sends results back as JSON
    res.json({message:"Recieved Correctly", received: results})
  }
      
  });
  */
  });

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");

});
