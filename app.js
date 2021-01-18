const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let itemArray = ["Buy food", "Make food", "Eat food"];

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
  var item = req.body.newList;
  itemArray.push(item);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
