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
  useNewUrlParser: true,
});

//database schema
const itemSchema = new mongoose.Schema({
  name: String,
});

//mongoose model
const Item = mongoose.model("Item", itemSchema);

const first = new Item({
  name: "welcome to your todo list!",
});
const second = new Item({
  name: "hit + to add new item !",
});
const third = new Item({
  name: "new",
});
const defaultItems = [first, second, third];

//root route
app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      //insert default items
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log("err");
        } else {
          console.log("successfully saved to database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { kindOfDay: "Today", newListItem: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newList;

  const item = new Item({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("successfully deleted checked item");
      res.redirect("/");
    }
  });
});

//work route
app.get("/work", function (req, res) {
  res.render("list", { kindOfDay: "Work List", newListItem: workArray });
});

app.post("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
