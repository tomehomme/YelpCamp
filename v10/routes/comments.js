var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//make a new comment
router.get("/new", middleware.isLoggedIn, function(req,res){
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
router.post("/", middleware.isLoggedIn, (req,res)=>{
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
						req.flash("error", "Something went wrong");
						console.log(err);
					} else {
						//add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						//save comment
						comment.save();
						//connect our comment to campground
						campground.comments.push(comment);
						campground.save();
						req.flash("success", "Successfully added comment");
						//redirect -- back to campground show page!
						res.redirect("/campgrounds/" + campground._id);
					}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentsOwnership,function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentsOwnership,function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentsOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err){
			res.redirect("back");
		}
		else {
			req.flash("sucess", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;