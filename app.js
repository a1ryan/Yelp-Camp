var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/camp");
var seedDB = require("./seeds");
var Comment = require("./models/comment");


mongoose.connect("mongodb://localhost/yelp_camp"); //creating a db for yelp camp on mongodb
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

app.get("/",function(req,res){
    // res.send("ahfhsdhfjdhfj");
    res.render("homePage");
})

app.get("/campgrounds",function(req,res){
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err) console.log(err);
        else res.render("campground/index",{campgrounds:allCampgrounds});
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
    res.render("campground/new");
})

app.get("/campgrounds/:id",function(req, res){
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
         if(err){
             console.log(err);
         }else{    
             res.render("campground/show", {campground: foundCampground}); 
         }
     });
})

// ========================
// COMMENT ROUTE    
// ========================

app.get("/campgrounds/:id/comment/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res){
    // 1. lookup campgroung using ID
        Campground.findById(req.params.id , function(err, campgroud){
            if(err){
                console.log(err);
            }else{
                // 2. create new comment
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        console.log(err)
                    }else{
                        // 3. connect the comment to the campgroud
                        campgroud.comments.push(comment);
                        campgroud.save();
                        // 4. redirect to the campground page
                        res.redirect('/campgrounds/' + campgroud._id);
                    }
                })    
            }
        })
    
})

app.listen(3000,function(){
    console.log("Please don't wait");
})