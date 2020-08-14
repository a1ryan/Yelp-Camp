var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/camp");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comment/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
})

router.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
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
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        // 3. connect the comment to the campgroud
                        campgroud.comments.push(comment);
                        campgroud.save();
                        // 4. redirect to the campground page
                        res.redirect('/campgrounds/' + campgroud._id);
                    }
                })    
            }
        })
    
});

//edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit",commentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
});

router.put("/campgrounds/:id/comments/:comment_id",commentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id); 
        }
    })
})

// comment delete route

router.delete("/campgrounds/:id/comments/:comment_id",commentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


function commentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the comment?
               if(foundComment.author.id.equals(req.user._id)){
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
