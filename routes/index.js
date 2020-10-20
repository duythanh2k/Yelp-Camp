var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Root Routes
router.get("/", function(req, res){
	res.render("home");
});

// =======================
// 		AUTH ROUTES
// =======================

//Show Register form
router.get("/register", function(req, res){
	res.render("register");
});
//Handle Sign Up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	//adding a 'newUser(username, hash-password)' into DataBase
	User.register(newUser, req.body.password, function(err, user){
		if(err){ //If the user Sign Up the same username
			//We get the error message in the package("passport-local-mongoose")
			req.flash("error", err.message); 
			return res.render("register");
		}
		//When the users has Sign Up, then we going to Log them in, authenticate them and then redirect the to "/campgrounds"
		//If we don't, If there is the problem in Signing the users up, then we going to console.log(err) and then render the form "register" again
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp! " + user.username); //'user.username' === 'newUser.username'
			res.redirect("/campgrounds");
		})
	});
});

//Show Login form
router.get("/login", function(req, res){
	res.render("login");
});
//Handle Login logic
//app.post("/login", middleware, callback)
router.post("/login",passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}) , function(req, res){
});

//Logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/");
});



module.exports = router;