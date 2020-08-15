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
    User = require("./models/user"),
    flash = require("connect-flash")

var cmpgRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/auth")

const PORT = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost/yelp_camp"); //creating a db for yelp camp on mongodb
mongoose.connect("mongodb+srv://yelpCamp:aaryan4vedi@cluster0.8skuh.mongodb.net/yelpCamp?retryWrites=true&w=majority"); //creating a db for yelp camp on mongodb

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(cmpgRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
    console.log(`\n =============== STARTED: on port ${ PORT } ==========\n`);
});