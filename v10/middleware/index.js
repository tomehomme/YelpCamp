var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware functions
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
	//is user logged in
		if (req.isAuthenticated()){	
			Campground.findById(req.params.id, (err,foundCampground)=>{
				if (err){
					req.flash("error", "Campground not found");
					res.redirect("/campgrounds");
				}
				else {
					//does this user own the campground
					if (foundCampground.author.id.equals(req.user._id)){
						next();
					}
					//otherwise also redirect
					else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
		}
		//if not, redirect
		else {
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		}
}

middlewareObj.checkCommentsOwnership = function (req, res, next){
	//is user logged in
	if (req.isAuthenticated()){	
		Comment.findById(req.params.comment_id, (err,foundComment)=>{
			if (err){
				res.redirect("back");
			}
			else {
				//does this user own the campground
				if (foundComment.author.id.equals(req.user._id)){
					next();
				}
				//otherwise also redirect
				else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	//if not, redirect
	else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

//MIDDLEWARE
middlewareObj.isLoggedIn = function (req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}



module.exports = middlewareObj;

