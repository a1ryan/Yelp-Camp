var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
    // res.send("ahfhsdhfjdhfj");
    console.log(" ======= @ Home Page ======");
    res.render("homePage");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res,  function(){
                req.flash("success", "Welcome to Yelp Camp " + user.username +" ;)");
                res.redirect("/campgrounds");
            });
        }
    });
});

//login route

router.get("/login", function(req, res){
    res.render("login");
    // req.flash("error", "Login first");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }
),function(req, res){});

//logout route

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

module.exports = router;