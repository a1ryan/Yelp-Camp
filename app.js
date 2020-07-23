var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
var campgrounds = [
    {name: "Salmon creek" ,image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"},
    {name: "Mount nothing" ,image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
    {name: "Lake of water" ,image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"}
]

app.get("/",function(req,res){
    // res.send("ahfhsdhfjdhfj");
    res.render("homePage");
})

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
})

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
})
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
})

app.listen(3000,function(){
    console.log("Please don't wait");
})