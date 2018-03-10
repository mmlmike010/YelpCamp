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

//css folder
app.use(express.static(__dirname + "/public"));



app.get("/", function(req, res){
    res.render("landing");
});

// INDEX show all campgrounds
app.get("/campgrounds", function(req, res){
        //Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds});
            }
        })
        //res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE ROUTE
app.post("/campgrounds", function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //create new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
   
   //redirect back to campgrounds page
   //res.redirect("/campgrounds"); //default redirect is the get request
});

//NEW- show form to create new campground
app.get("/campgrounds/new", function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    //.exec executess queires
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
               //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// =================================
// COMMENTS ROUTES
// =================================

app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelp camp server has started");
});