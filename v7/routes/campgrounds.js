var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");



// INDEX - SHOW ALL CAMPGROUNDS
// retrieve all campgrounds from database
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});


// CREATE - ADD NEW CAMPGROUND TO DB
// makes a new campground, and redirects to all the campgrounds
router.post("/", (req,res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description
	var newCampground = {name:name, image:image, description:description};
// 	create a new campground and save it to the DB
	Campground.create(newCampground, function(err, newCamp){
		if (err){
			console.log(err);
		} else {
		// 	redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});


// NEW - SHOW FORM TO CREATE A NEW CAMPGROUND
// shows the form to submit a post request to /campgrounds
router.get("/new", (req,res) => {
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
			console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})


module.exports = router;