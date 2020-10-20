var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//"index.js" is suppose to be a main file where other thing are require
var middleware = require("../middleware");//The reason that name is "index.js" because there are a special name that you just require a 'directory' but not a 'file'


//INDEX - display all campgrounds from DB
router.get("/", middleware.isLoggedIn, function(req, res){
	//get all campgrounds from DB
	//note: {} defines all the campgrounds in the DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			req.flash("error", err.message);
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});

});

//CREAT - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCampground = {name: name, image: image, price: price, description: desc, author: author};

	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCamp){
		if(err){
			console.log(err);
		}
		else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", middleware.isLoggedIn, function(req, res){
	//find the campground with provided ID
	//Campground.findById(id, callBack())
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
});

//EDIT - show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE - update a new campground that has editted
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//Find and Update the correct Campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + updatedCampground._id); //req.params.id == updatedCampground._id
		}
	});
	//Redirect somewhere(Show page)
});

//DESTROY - delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
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