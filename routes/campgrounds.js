var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX show all campgrounds
router.get("/", function(req, res){
        //Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
            }
        })
        //res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE ROUTE
router.post("/", function(req,res){
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
router.get("/new", function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
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

module.exports = router;