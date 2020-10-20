//======================
//		MIDDLEWARE
//======================
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//Middleware authenticate the user login
middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
}

//Middleware check the Campground ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found!");//This won't be ever happen
				res.redirect("back");
			}
			else{
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				//otherwise, redirect
				else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	//if not, redirect
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

//Middleware check the Comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found!");//This won't be ever happen
				res.redirect("back");
			}
			else{
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				//otherwise, redirect
				else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	//if not, redirect
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}



module.exports = middlewareObj;