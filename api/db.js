const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  connectTimeout: 15000,
});

connection.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/color", (req, res) => {
  const { color } = req.body;

  const sql = "INSERT INTO backgroundcolor (color) VALUES (?)";
  connection.query(sql, [color], (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(`"${color}" color has been inserted into myDB database.`);
    res.status(200).send("Color saved successfully");
  });
});

app.get("/color", (req, res) => {
  const sql = "SELECT color FROM backgroundcolor ORDER BY id DESC LIMIT 1";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.length > 0) {
      const color = result[0].color;
      res.status(200).json({ color });
    } else {
      res.status(404).send("Color not found");
    }
  });
});
app.get("/", (req, res) => {
  res.send("Welcome to the Color API!");
});
app.get("/:universalURL", (req, res) => {
  res.send("404 URL NOT FOUND");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
