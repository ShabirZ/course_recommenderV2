const express = require("express");
const app = express();
const mysql = require('mysql2');
require('dotenv').config(); // Load the .env file

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });
connection.connect();
app.get('/', (req, res) => {

    connection.query("SELECT DISTINCT course_name, course_code FROM courseschedule;", (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Database query error');
      } else {
        console.log(results);
        res.json(results); // Sends results back as JSON
      }
    });
  });

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");

});
