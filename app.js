var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var mongoose = require("mongoose");
//connect js file for schema setup
var Campground = require("./models/campground");
mongoose.connect("mongodb://localhost/yelp_camp");
//require seeds file
var seedDB = require("./seeds");
seedDB();
//coments
var Comment = require("./models/comment");
//authentication
var passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

//REQUIRING ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//css folder
app.use(express.static(__dirname + "/public"));

//PASSPORT configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUnintialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for current user as shown in the app.get for campgrounds
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

/********************************************/
/*    EXPRESS ROUTER */
/*******************************************/
//tells our apps to use these routes.
app.use(indexRoutes);
//tells app that every slash starts with campgrounds
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelp camp server has started");
});