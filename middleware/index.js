//ALL MIDDLEWARE GOES HERE

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
        //is user logged in?
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else{

                    // If foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundCampground) {
                            req.flash("error", "Item not found.");
                            return res.redirect("back");
                    }
                    // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                   
                    //does user own the campground?
                    //NOTE: foundCampground.author.id is a mongoose object, and req.user._id is a string
                    //use mongoose equals function
                    if(foundCampground.author.id.equals(req.user._id)){
                        //function to proceed past middleware
                        next();
                    }
                    else{
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }
            });            
        } 
        
        else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
}

//checks to see if you're logged in and your id matches the campgrounds id
middlewareObj.checkCommentOwnership = function(req,res,next){
        
        //is user logged in?
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else{
                    
                    // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundComment) {
                            req.flash("error", "Item not found.");
                            return res.redirect("back");
                    }                    
                    
                    //does user own the comment?
                    //NOTE: foundComment.author.id is a mongoose object, and req.user._id is a string
                    //use mongoose equals function
                    if(foundComment.author.id.equals(req.user._id)){
                        //function to proceed past middleware
                        next();
                    }
                    else{
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });            
        } 
        
        else{
            res.redirect("back");
            req.flash("error", "You need to be logged in to do that");
        }
}
        
middlewareObj.isLoggedIn = function(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}



module.exports = middlewareObj;