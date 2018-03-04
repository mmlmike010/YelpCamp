var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
/*
Campground.create({
   name: "Granite Hill", 
   image: "https://farm9.staticflickr.com/8221/8288665755_a4517729d4.jpg",
   description: "this is a huge granite hill, with no bathrooms, no water, and beautiful granite"
}, function(err, campground){
    if(err){
        console.log(err);
    }
    else{
        console.log("newly created campground: ");
        console.log(campground);
    }
});
*/

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
                res.render("index", {campgrounds:allCampgrounds});
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
   res.render("new"); 
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
               //render show template with that campground
        res.render("show", {campground: foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelp camp server has started");
});