const express = require("express");
const fs = require("fs");
const path = require("path");

const dbJsonData = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8080;

// console.log(dbJsonData);
// Sets up the Express app to handle data parsing
// Needed to add this middleware for css to work (https://stackoverflow.com/questions/13395742/can-not-get-css-file)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  console.log(dbJsonData);
  res.json(dbJsonData);
});

app.get("/api/notes/:id", function (req, res) {});

app.post("/api/notes", function (req, res) {
  dbJsonData.push(req.body);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(dbJsonData),
    function (err) {
      if (err) throw error;
    }
  );
});
app.post("/api/notes", function (req, res) {
  dbJsonData.push(req.body);
  fs.writeFile(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify(dbJsonData),
    function (err) {
      if (err) throw err;
      console.log("successfully wrote to db");
    }
  );
  res.json(req.body);
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
