var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds = [
		{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Crossing Hills", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Crossing Hills", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
			{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Crossing Hills", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c73267fdd9044c551_340.jpg"}
	];

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// landing page
app.get("/", (req,res)=>{
	res.render("landing");
});

// shows all the campgrounds
app.get("/campgrounds", (req,res) => {
	res.render("campgrounds", {campgrounds:campgrounds})
});


// makes a new campground, and redirects to all the campgrounds
app.post("/campgrounds", (req,res) => {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name:name, image:image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds")
// 	get data from form, and add to campgrounds array
// 	redirect back to campgrounds page
});

// shows the form to submit a post request to /campgrounds
app.get("/campgrounds/new", (req,res) => {
	res.render("new.ejs");
});

app.listen(3000, function(){
	console.log("The YelpCamp Server has started!");
});