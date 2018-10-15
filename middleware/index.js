//ALL MIDDLEWARE GOES HERE

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
        //is user logged in?
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    res.redirect("back");
                } else{
                    //does user own the campground?
                    //NOTE: foundCampground.author.id is a mongoose object, and req.user._id is a string
                    //use mongoose equals function
                    if(foundCampground.author.id.equals(req.user._id)){
                        //function to proceed past middleware
                        next();
                    }
                    else{
                        res.redirect("back");
                    }
                }
            });            
        } 
        
        else{
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
                    //does user own the comment?
                    //NOTE: foundComment.author.id is a mongoose object, and req.user._id is a string
                    //use mongoose equals function
                    if(foundComment.author.id.equals(req.user._id)){
                        //function to proceed past middleware
                        next();
                    }
                    else{
                        res.redirect("back");
                    }
                }
            });            
        } 
        
        else{
            res.redirect("back");
        }
}
        
middlewareObj.isLoggedIn = function(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = middlewareObj;