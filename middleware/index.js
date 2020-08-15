// all the middlewares goes here
var Campground = require("../models/camp");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.ownership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground does not exists");
                res.redirect("back");
            }else{
                //does user own the campground?
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error","Permission denied >_<");
                    res.redirect("back");
               }
            }
        });
    }else{
        req.flash("error", "Please Login first -_-");
        res.redirect("back");
    }
}

middlewareObj.commentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the comment?
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                    req.flash("error", "Permission denied :(");
                    res.redirect("back");
               }
            }
        });
    }else{
        req.flash("error", "Please Login first >_<");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in -_-");
    res.redirect("/login");
};

module.exports = middlewareObj;
