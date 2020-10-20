var mongoose   = require("mongoose");
var	Campground = require("./models/campground");
var	Comment    = require("./models/comment");


var data = [
	{
		name: "Acadia National Park",
 		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2018%2F05%2Facadia-national-park-maine-SCENICCAMP0118.jpg",
 		description: "Located on Mount Desert Island, Acadia National Park is the Pine Tree State’s natural jewel. The park boasts 17 million acres of forest, 6,000 lakes and ponds, and 32,000 miles of rivers and streams to offer a scenic backdrop to your hiking and camping. The park has three campgrounds to set up your tent: Blackwoods (close to Bar Harbor), Seawall (less touristy), and Schoodic Woods (on the Schoodic Peninsula). Acadia is undergoing a phased reopening — campgrounds will be opening no earlier than July 1, but many hiking trails are currently open. Check the Acadia National Park website for more information."
	},
	{
		name: "White Mountain National Forest",
		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2018%2F05%2Fwhite-mountain-national-forest-new-hampshire-SCENICCAMP0118.jpg",
		description: "If you’re looking for a rugged hike, look no further than this northernmost part of the Appalachian Valley. The sights are particularly magical in the fall when leaf-peeping season is at its peak. Plus, the forest has several campgrounds with a combined hundreds of campsites. Currently, several campgrounds, climbing areas, and shelters remain closed."
	},
	{
		name: "Minnewaska State Park Reserve",
		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2018%2F05%2Fminnewaska-state-park-reserve-new-york-SCENICCAMP0118.jpg",
		description: "Only 94 miles outside of New York City, this state park reserve sits on Shawangunk Ridge, more than 2,000 feet above sea level, surrounded by rocky terrain. That’s a lot of space to hike, bike, and especially enjoy the view. The park is currently operating with a reduced capacity, and some facilities are closed — the adjacent campground is also temporarily closed."
	}
];


function seedDB() {
	//Remove all campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed all campgrounds!!");

		//Add a few campgrounds
		//NOTE: Put Campground.create function inside the Campground.deleteMany to wait until remove all the
		//existing campgrounds and then add a new campground.
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				}
				else{
					console.log("Added a new campground.");
					//Create a comment
					Comment.create(
						{
							text: "This place is great, but I wish there was internet!",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							}
							else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment.");
							}
					});
				}
			});
		});

	});
	//Add a few comments

}

module.exports = seedDB;
