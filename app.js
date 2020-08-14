var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStraegy = require("passport-local"),
    Campground = require("./models/camp"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override"),
    User = require("./models/user")

var cmpgRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/auth")


mongoose.connect("mongodb://localhost/yelp_camp"); //creating a db for yelp camp on mongodb
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
// seedDB();

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "I'm on",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStraegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(cmpgRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000,function(){
    console.log("Please don't wait");
})