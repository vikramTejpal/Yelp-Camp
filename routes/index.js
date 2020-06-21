
var express = require("express");
var router  = express.Router()

var passport = require("passport")
var User     = require("../models/user")
//===================================================================================================================
// AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUTES AUTHROUT

//Show register form 
router.get("/register",function(req,res)
	   {
	res.render("register",{currentUser:req.user,error:req.flash("error"),success:req.flash("success")});
})
//handles the POST route of register--> passport creates a new user in the db
router.post("/register",function(req,res)
		{
	var newUser = new User({username:req.body.username});
	//This way it will store a hased password
	//for plain text we could do var password=new User({password:req.body.password}) but no 
	User.register(newUser,req.body.password,function(err,user)
				 {
		if(err)
			{
				console.log(err);
				req.flash("error",err.message)
				return res.redirect("/register");
			}
				passport.authenticate("local")(req,res,function(){
				req.flash("success","welcome to yelpCamp " + user.username)
				res.redirect("/campgrounds")
				})
	})
})
//Shows the login form
router.get("/login",function(req,res)
	   {
	res.render("login",{currentUser:req.user,error:req.flash("error"),success:req.flash("success")});
})
//handling login POST logic
//when logging in through passport js we use a middleware, which takes care of all the logging in logic for us
//its like app.post("/login",middleware,callBack)
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){})

router.get("/logout",function(req,res)
	   {
	req.logout();
	req.flash("success","Logged you out")
	res.redirect("/campgrounds")
})

//pass this function to any route you dont want to access without logging in
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error","Please login first!!")
	res.redirect("/login")
}
module.exports = router;