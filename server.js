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
  // console.log(dbJsonData);
  res.json(dbJsonData);
});

app.get("/api/notes/:note", function (req, res) {
  var chosen = req.params.note;

  // console.log(chosen);

  for (var i = 0; i < dbJsonData.length; i++) {
    if (chosen === dbJsonData[i].id) {
      return res.json(dbJsonData[i]);
    }
  }

  return res.json(false);
});

app.post("/api/notes", function (req, res) {
  dbJsonData.push(req.body);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(dbJsonData),
    function (err) {
      if (err) throw err;
      console.log("successfully wrote to db");
    }
  );
  res.json(req.body);
});

app.delete("/api/notes/:id", function (req, res) {
  const currentId = req.params.id;

  let newArr = dbJsonData.filter((i) => i.id !== currentId);
  console.log(newArr);
  let newFile = fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(newArr),
    function (err) {
      if (err) throw err;
      console.log("successfully deleted from db");
    }
  );
  console.log(dbJsonData);
  res.json(newFile);
});

// app.delete("/api/notes/:id", function (req, res) {
//   let noteID = req.params.id;
//   fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", function (
//     err,
//     data
//   ) {
//     if (err) throw err;
//     const json = JSON.parse(data);
//     const newJson = json.filter((note) => note.id !== noteID);
//     fs.writeFile(
//       path.join(__dirname, "./db/db.json"),
//       JSON.stringify(newJson),
//       function (err) {
//         if (err) throw err;
//         console.log("successfully deleted, and wrote to db");
//       }
//     );
//   });
//   res.sendStatus(200);
//   // can also do: res.json({ ok: "true" });
// });

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
