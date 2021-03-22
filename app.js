const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//database
//connect database
mongoose.connect("mongodb://localhost:27017/todolistdb", {
  useUnifiedTopology: true,
});

//database schema
const itemsSchema = {
  name: String,
};

//mongoose model
const Item = mongoose.model("Item", itemsSchema);

//db documents
const item1 = new Item({
  name: "welcome to todo list",
});
const item2 = new Item({
  name: "Hit the + button to add new line",
});
const item3 = new Item({
  name: "<--- Hit this to delete item",
});

const defaultArray = [item1, item2, item3];

//insert items
Item.insertMany(defaultArray, function (err) {
  if (err) {
    console.log("err");
  } else {
    console.log("successfully saved to database");
  }
});

//root route
app.get("/", function (req, res) {
  res.render("list", { kindOfDay: "Today", newListItem: items });
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
