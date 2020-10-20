var express = require("express");
//{mergeParams: true} Merge the params from the "campground" and the "comment" together.
//Inside the "Comments Routes" we're able to access the ':id' that we define
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//"index.js" is suppose to be a main file where other thing are require
var middleware = require("../middleware");//The reason that name is "index.js" because there are a special name that you just require a 'directory' but not a 'file'


// ===========================
// 		COMMENTS ROUTES
// ===========================

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	//Find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
	
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			//Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something Went Wrong!");
					console.log(err);
				}
				else{
					//Add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save the comment
					comment.save();
					////Connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//Redirect back to campground show page
					req.flash("success", "Added Comment Successfully!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	
});

//Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
	
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//finByIdAndUpdate(the ID to finded by, the DATA to updated with, callback)
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id); //req.params.id === updatedComment._id
		}
	});
});

//Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment Deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;