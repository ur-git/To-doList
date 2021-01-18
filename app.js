const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

let itemArray = ["Buy food", "Make food", "Eat food"];
let workArray = [];

//root route
app.get("/", function (req, res) {
  let dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };
  let today = new Date();
  let current = today.toLocaleDateString("en-us", dateFormat);

  res.render("list", { kindOfDay: current, newListItem: itemArray });
});

app.post("/", function (req, res) {
  let item = req.body.newList;

  if (req.body.List === "Work") {
    workArray.push(item);
    res.redirect("/work");
  } else {
    itemArray.push(item);
    res.redirect("/");
  }
});

//work route
app.get("/work", function (req, res) {
  res.render("list", { kindOfDay: "Work List", newListItem: workArray });
});

app.post("/work", function (req, res) {});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
