var express = require("express");
var router = express.Router();
var Campground = require("../models/camp");

router.get("/campgrounds",function(req,res){
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err) console.log(err);
        else res.render("campground/index",{campgrounds:allCampgrounds, currentUser: req.user});
    })
    // res.render("campgrounds",{campgrounds:campgrounds});
})

router.post("/campgrounds",isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image:image, description:desc, author: author};
    // campgrounds.push(newCampground);
    //create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyAdded){
        if(err) console.log(err);
        else {
            res.redirect("/campgrounds");
        }
    })
})
router.get("/campgrounds/new",isLoggedIn, function(req,res){
    res.render("campground/new");
})

router.get("/campgrounds/:id",function(req, res){
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
         if(err){
             console.log(err);
         }else{    
             res.render("campground/show", {campground: foundCampground}); 
         }
     });
});
// edit campgrounds route
router.get("/campgrounds/:id/edit",ownership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
           res.render("campground/edit", {campground: foundCampground});
    });
});

router.put("/campgrounds/:id",ownership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// destroy camp

router.delete("/campgrounds/:id",ownership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

function ownership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                //does user own the campground?
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                    res.redirect("back");
               }
            }
        });
    }else{
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
