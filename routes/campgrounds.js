var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// goes back to main directory, then selects which folder to go to
var middleware = require("../middleware/index.js");

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
router.post("/", middleware.isLoggedIn, function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author};
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
router.get("/new", middleware.isLoggedIn, function(req,res){
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){

            //dont need error catch cus find by id would have catched error during checkCampgroundOwnership()
            Campground.findById(req.params.id, function(err, foundCampground){
                    //does user own the campground?
                    //NOTE: foundCampground.author.id is a mongoose object, and req.user._id is a string
                    res.render("campgrounds/edit", {campground: foundCampground});
            });            
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
     // find and update the correct campground
     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
         if(err){
             res.redirect("/campgrounds");
         } else{
             res.redirect("/campgrounds/" + req.params.id);
         }
     });
     // redirect somewhere (show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;