var express 			= require("express"),
	app 				= express(),
 	mongoose 			= require("mongoose"),
    bodyParser 			= require("body-parser"),
	Campground 			= require("./models/campground"),
	seedDB				= require("./seeds"),
	Comment 			= require("./models/comment"),
	passport			= require("passport"),
	LocalStrategy 		= require("passport-local"),
	User			 	= require("./models/user"),
	methodOverride		= require("method-override");
//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// seedDB(); seed the database

//passport configuration
app.use(require("express-session")({
	secret: "Today, Happy got a cold cold cold cooold shower!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//end passport configuration

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function(){
	console.log("The YelpCamp Server has started!");
});