//We can now create,read, update and delete campgrounds and comments, there are permissions there as well(there is authentication and authorisation) so you cant create something if you are not logged in and  you can not change anything that doesnt belong to you.

/*heroku config:set GEOCODER_API_KEY=AIzaSyALUcezGsdqxuIQiHbtOdmYv5ASAO6Bq0Y*/
require('dotenv').config();
var express       = require("express");
var app           = express();
var Campground    = require("./models/campground")
var Comment       = require("./models/comment")
var User          = require("./models/user")
var seedDB        = require("./seed");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var methodOveride = require("method-override");
var flash         = require("connect-flash");
var NodeGeocoder  = require("node-geocoder");
//Seedig the database
//seedDB();
app.set("view engine","ejs")
var bodyParser    = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))
var mongoose      = require("mongoose");
mongoose.connect('mongodb+srv://sharmavikram449:8699718171@Aa@cluster0-h8k1u.mongodb.net/<dbname>?retryWrites=true&w=majority', { 
	useNewUrlParser : true, 
	useCreateIndex  : true
}).then(() => {
	console.log("connected to DB");
}).catch(err => {
	console.log("ERROR",err.message)
});
//for css
app.use(express.static(__dirname + "/public"));

app.use(methodOveride("_method"))
app.use(flash())
//requiring routes
var campgroundsRoutes = require("./routes/campgrounds"),
	commentsRoutes    = require("./routes/comments"),
	indexRoutes       = require("./routes/index");

/*app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});*/

//PASPPORT CONFIGURATION
app.use(require("express-session")({
	secret:"this is secret key and it can be anything",
	resave:false,
	saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(campgroundsRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP,function()
	{
		console.log("Yelp Camp Server Started At Port Number 3000");	
	})