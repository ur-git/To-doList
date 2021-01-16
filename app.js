const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  console.log("server is running");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
