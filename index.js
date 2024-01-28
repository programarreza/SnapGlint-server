const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "snapglint",
});

// signup post api
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

// login post api
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      const id = data[0].id;
      const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 365 });
      return res.json({
        Login: true,
        token,
        user: {
          userId: data[0].id,
          name: data[0].name,
          email: data[0].email,
          image: data[0].image,
        },
      });
    } else {
      return res.json("Fail");
    }
  });
});

// add blog api
app.post("/add_blog", (req, res) => {
  const sql =
    "INSERT INTO blog (`userId`, `title`, `description`, `image`) VALUE (?)";
  const values = [
    req.body.userId,
    req.body.title,
    req.body.description,
    req.body.image,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.listen(port, () => {
  console.log(`SnapGlint on port ${port}`);
});
