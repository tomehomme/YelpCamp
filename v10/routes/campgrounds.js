var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, (req,res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, image:image, description:description, author:author};
	
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
router.get("/new", middleware.isLoggedIn, (req,res) => {
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, (err,foundCampground)=>{
		res.render("campgrounds/edit", {campground:foundCampground});
	});			
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
	//find and update correct campground
	//redirect somewhere (show page)
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
		if (err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})	   
});

// DESTORY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});



module.exports = router;