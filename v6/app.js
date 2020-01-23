var express 			= require("express"),
	app 				= express(),
 	mongoose 			= require("mongoose"),
    bodyParser 			= require("body-parser"),
	Campground 			= require("./models/campground"),
	seedDB				= require("./seeds"),
	Comment 			= require("./models/comment"),
	passport			= require("passport"),
	LocalStrategy 		= require("passport-local"),
	User			 	= require("./models/user");



mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

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

// landing page
app.get("/", (req,res)=>{
	res.render("landing");
});


// INDEX - SHOW ALL CAMPGROUNDS
// retrieve all campgrounds from database
app.get("/campgrounds", function(req, res){
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
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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
// ==========================
// COMMENTS ROUTE
// ==========================


app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
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
app.post("/campgrounds/:id/comments", isLoggedIn, (req,res)=>{
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

//==================
//AUTH ROUTES
//==================

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
//LOGOUT ROUTE
app.get("/logout", (req,res)=>{
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

app.listen(3000, function(){
	console.log("The YelpCamp Server has started!");
});