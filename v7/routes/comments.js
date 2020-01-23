var express = require("express");
var router = express.Router({mergeParameters:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//make a new comment
router.get("/new", isLoggedIn, function(req,res){
	//find campground by id
	Campground.findById(req.params.id, function(err,campground){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
	
})

//post route for comments
router.post("/", isLoggedIn, (req,res)=>{
	//find campground by id
	Campground.findById(req.params.id, (err,campground)=>{
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
				//console.log(req.body.comment); //shows how we are using name="comment[author]"
				//create new comment
				Comment.create(req.body.comment, (err,comment)=>{
					if (err){
						console.log(err);
					} else {
						//connect our comment to campground
						campground.comments.push(comment);
						campground.save();
						//redirect -- back to campground show page!
						res.redirect("/campgrounds/" + campground._id);
					}
			});
		}
	});
});

//MIDDLEWARE
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;