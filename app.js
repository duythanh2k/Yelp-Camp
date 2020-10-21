var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

//Requiring Routes
var indexRoutes      = require("./routes/index"),
	campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments");


// mongoose.connect("mongodb://localhost/yelp_camp_v11", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect("mongodb+srv://duythanh:Password123@yelpcamp.fkdg7.mongodb.net/yelpcamp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//Tell express to serves the public directory by "__dirname/public"
app.use(express.static(__dirname + "/public")); //console.log(__dirname);
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();   //Seed the DataBase

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Harry Porter is the greatest novel I've read the whole time in my life",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Create new campground
// Campground.create(
// 	{
// 		name: "Acadia National Park",
// 		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2018%2F05%2Facadia-national-park-maine-SCENICCAMP0118.jpg",
// 		description: "Located on Mount Desert Island, Acadia National Park is the Pine Tree State’s natural jewel. The park boasts 17 million acres of forest, 6,000 lakes and ponds, and 32,000 miles of rivers and streams to offer a scenic backdrop to your hiking and camping. The park has three campgrounds to set up your tent: Blackwoods (close to Bar Harbor), Seawall (less touristy), and Schoodic Woods (on the Schoodic Peninsula). Acadia is undergoing a phased reopening — campgrounds will be opening no earlier than July 1, but many hiking trails are currently open. Check the Acadia National Park website for more information."
	
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("CAMGROUND ADDED!");
// 			console.log(campground);
// 		}
// });


//Using an "app.use()" which will call the below function on every single routes
app.use(function(req, res, next){
    //this line below is to pass the 'currentUser'(currentUser == user) to every single template
	res.locals.currentUser = req.user; //"req.user" will be either empty if no one signed in, or it will contains the username and the id of the currentUser
	//this line below is to pass (everything in the flash()) under 'message' to every single template
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("The YelpCamp Server Has Started!");
// });
app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp is starting on port 3000!");
});
