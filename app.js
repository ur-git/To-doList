const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//database
//connect database
mongoose.connect("mongodb://localhost:27017/todolistdb", {
  useNewUrlParser: true,
});

//Items schema
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

//List schema
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});
const List = mongoose.model("List", listSchema);

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

//custom route
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // show existing list
        res.render("list", {
          kindOfDay: foundList.name,
          newListItem: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newList;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName == "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == " Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("successfully deleted checked item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.post("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
