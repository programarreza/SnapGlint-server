const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "snapglint",
});

app.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO login (`name`, `email`, `password`, `image`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.image,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.listen(port, () => {
  console.log(`SnapGlint on port ${port}`);
});
