const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/item").then(
    () => console.log('connected to db'));


const SchemaItem = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", SchemaItem);

const item1 = new Item({
    name: "get up"
});
const item2 = new Item({
    name: "get"
});

const defaultitem = [item1, item2];
// Item.insertMany(defaultitem);
app.get("/", function (req, res) {
    var date = new Date();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var day = date.toLocaleString('en-us', options);

    Item.find().then(function (founditems) {
        if (founditems.length == 0) {
            Item.insertMany(defaultitem);
            res.redirect("/")
        }
        else {
            res.render("list", { typeofday: day, newitems: founditems });
        }


    })
        .catch(function (err) {
            console.log(err);



        });
});

app.post("/", function (req, res) {
    const newItem= req.body.item;
    const itemNew = new Item({
        name:newItem
    });

    itemNew.save();
    res.redirect("/");
});

app.post("/delete",function(req,res){
const checkItem=req.body.checkbox;
Item.findByIdAndRemove(checkItem).then(function(err){})
res.redirect("/");
})



app.listen(4000, function () {
    console.log("server has started");
});
