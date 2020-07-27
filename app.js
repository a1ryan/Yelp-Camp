var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp"); //creating a db for yelp camp on mongodb

//setting up schema
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model("Campground", campgroundsSchema);

// Campground.create({
//         name: "Mount nothing" ,
//         image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "This mountain has nothing on top just like all mountains"
//     }, function(err,campground){
//     if(err){
//         console.log("Something went wrong")
//         console.log(err);
//     }else{
//         console.log("newly created: ")
//         console.log(campground);
//     }
// });


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/",function(req,res){
    // res.send("ahfhsdhfjdhfj");
    res.render("homePage");
})

app.get("/campgrounds",function(req,res){
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err) console.log(err);
        else res.render("index",{campgrounds:allCampgrounds});
    })
    // res.render("campgrounds",{campgrounds:campgrounds});
})

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name,image:image, description:desc};
    // campgrounds.push(newCampground);
    //create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyAdded){
        if(err) console.log(err);
        else {
            res.redirect("/campgrounds");
        }
    })
})
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
})

app.get("/campgrounds/:id",function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
             console.log(err);
         }else{    
             res.render("show", {campground: foundCampground}); 
         }
     })
})

app.listen(3000,function(){
    console.log("Please don't wait");
})