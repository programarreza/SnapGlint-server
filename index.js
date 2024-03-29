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
  host: "b51vfb3ij6ej1jbpl7hv-mysql.services.clever-cloud.com",
  user: "uwq6doojfdkpfvs0",
  password: "S4aed6t2Fqb6LzjKo9gL",
  database: "b51vfb3ij6ej1jbpl7hv",
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

// get all blogs
app.get("/blogs", (req, res) => {
  const sql = "SELECT * FROM blog";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

// get specific single blogs
app.get("/blogs_details/:id", (req, res) => {
  const sql = "SELECT * FROM blog WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

// blog update api
app.put("/blog_update/:id", (req, res) => {
  const sql =
    "UPDATE blog SET `title`=?, `description`=?, `image`=? WHERE id=?";
  const id = req.params.id;
  db.query(
    sql,
    [req.body.title, req.body.description, req.body.image, id],
    (err, result) => {
      if (err) return res.json({ Message: "Error inside server" });
      return res.json(result);
    }
  );
});

app.delete("/blog_delete/:id", (req, res) => {
  const sql = "DELETE FROM blog WHERE id =?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});


// favorite post api
app.post('/favorite', (req, res) => {
  const sql =
    "INSERT INTO favorites (`userId`, `id`, `title`, `description`, `image`) VALUE (?)";
  const values = [
    req.body.userId,
    req.body.id,
    req.body.title,
    req.body.description,
    req.body.image,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
})

// favorite get api
app.get("/favorite", (req, res) => {
  const sql = "SELECT * FROM favorites";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});


// add comment post api
app.post("/comment", (req, res) => {
  const sql =
    "INSERT INTO comments (`blogId`, `name`, `email`, `message`, `image`) VALUE (?)";
  const values = [
    req.body.blogId,
    req.body.name,
    req.body.email,
    req.body.message,
    req.body.image,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


// comment get api
app.get("/comments/:blogId", (req, res) => {
  const sql = "SELECT * FROM comments WHERE blogId =?";
  const blogId = req.params.blogId;
  db.query(sql, [blogId], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});
app.listen(port, () => {
  console.log(`SnapGlint on port ${port}`);
});

