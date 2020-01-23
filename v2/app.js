var express = require("express"),
	app 	= express(),
 	mongoose = require("mongoose"),
    bodyParser = require("body-parser")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.find()

// Campground.create(

// 	{
// 		name: "Salmon Creek", 
// 		image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9", 
// 		description: "This is a huge Salmon Creek.. no bathrooms, big creek"
// 	}, function(err,campground){
// 	 if (err){
// 		 console.log(err);
// 	 } else {
// 		 console.log("NEWLY CREATED CAMPGROUND");
// 		 console.log(campground)
// 	 }
//  });

// landing page
app.get("/", (req,res)=>{
	res.render("landing");
});


// INDEX - SHOW ALL CAMPGROUNDS
// retrieve all campgrounds from database
app.get("/campgrounds", (req,res) => {
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			// 	render file after getting data
			 res.render("index", {campgrounds: allCampgrounds});
		}
	});
});


// CREATE - ADD NEW CAMPGROUND TO DB
// makes a new campground, and redirects to all the campgrounds
app.post("/campgrounds", (req,res) => {
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
app.get("/campgrounds/new", (req,res) => {
	res.render("new.ejs");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(3000, function(){
	console.log("The YelpCamp Server has started!");
});