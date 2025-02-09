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
  console.log('yes')
    console.log("recieved response:", req.body.info);
    
    connection.query("SELECT DISTINCT course_name, course_code FROM courseschedule;", (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Database query error');
      } else {
        console.log(results);
        //res.json(results); // Sends results back as JSON
        res.json({message:"Recieved Correctly", received: results})
      }
        
    });

  });

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");

});
