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

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/color", async (req, res) => {
  try {
    const { colorObject } = req.body;

    if (!colorObject || !colorObject.color || !colorObject.colorMeaning) {
      return res
        .status(400)
        .send(
          "Invalid input: colorObject is required with color and colorMeaning."
        );
    }

    const { color, colorMeaning } = colorObject;

    const sql =
      "INSERT INTO backgroundcolor (color, color_meaning) VALUES (?, ?)";
    await queryAsync(sql, [color, colorMeaning]);

    console.log(
      `"${color}" color and ${colorMeaning} meaning have been inserted into myDB database.`
    );
    return res.status(200).send("Color and meaning saved successfully");
  } catch (err) {
    console.error("Error executing MySQL query:", err.message);
    return res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.get("/color", async (req, res) => {
  try {
    const sql = "SELECT * FROM backgroundcolor ORDER BY id DESC LIMIT 1";
    const result = await queryAsync(sql);

    if (result.length > 0) {
      const color = result[0].color;
      const colorMeaning = result[0].colormeaning;
      return res.status(200).json({ color, colorMeaning });
    } else {
      return res.status(404).send("Color not found");
    }
  } catch (err) {
    console.error("Error executing MySQL query:", err.message);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  return res.send("Welcome to the Color API!");
});

app.get("/:universalURL", (req, res) => {
  return res.status(404).send("404 URL NOT FOUND");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
