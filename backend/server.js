const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const apiRouter = require("./routes/api");
const coherreRouter = require("./routes/coherre");


const app = express();
const port = 5173;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// mount our api router here
app.use("/api", apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  console.log("req.path", req.path);
  res.sendFile(path.join(__dirname + "../client/build/index.html"));
});

app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});




module.exports = app;






// const express = require("express");
// const app = express();
// const port = 5173;

// app.get("/hello", function (req, res) {
//   res.send("Hello World!");
// });

// app.listen(port, function () {
//   console.log(`Example app listening on port ${port}!`);
// });