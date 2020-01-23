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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
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
	res.redirect("/campgrounds");
})


//MIDDLEWARE
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;