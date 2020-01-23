var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var passport = require("passport");
var User = require("../models/user");

// landing page
router.get("/", (req,res)=>{
	res.render("landing");
});

//==================
//AUTH ROUTES
//==================

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
			req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
//LOGOUT ROUTE
router.get("/logout", (req,res)=>{
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campgrounds");
})

module.exports = router;