var mongoose = require("mongoose");
var Campground = require("./models/camp");
var Comment = require("./models/comment");
var data = [
    
]
function seedDB(){
    Campground.remove({}, function(err){
        console.log("removed");

        //adding campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
                if(err) console.log(err)
                else {
                    console.log("added a camp");
                
                // create a comment
                Comment.create(
                    {
                        text: "No internet",
                        author: "aaryan"
                    },function(err, comment){
                        if(err) console.log(err)
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("comment added");
                        }
                    });
                }   
            });
        });
    }); 
    
}

module.exports = seedDB;

