const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const connection = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  const { colorObject } = req.body;
  const { color, colorMeaning } = colorObject;

  const sql = "INSERT INTO backgroundcolor (color, colormeaning) VALUES (?, ?)";
  connection.query(sql, [color, colorMeaning], (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(
      `"${color}" color and ${colorMeaning} meaning have been inserted into myDB database.`
    );
    res.status(200).send("Color and meaning saved successfully");
  });
});

app.get("/color", (req, res) => {
  const sql = "SELECT * FROM backgroundcolor ORDER BY id DESC LIMIT 1";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("These are the results", result);
    if (result.length > 0) {
      const color = result[0].color;
      const colorMeaning = result[0].colormeaning;
      res.status(200).json({ color, colorMeaning });
    } else {
      res.status(404).send("Color not found");
    }
    connection.release();
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
