var express = require("express");
var router  = express.Router()
var Campground = require("../models/campground");
var Comment    = require("../models/comment")
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
router.get("/",function(req,res)
	   {
			res.render("landing",{currentUser:req.user,error:req.flash("error"),success:req.flash("success")});
})
//index route
router.get("/campgrounds",function(req,res)
	   {
			//Campground.find({}) ==> will get us all the data in our Campgroud collection
			Campground.find({},function(err,allCampgrounds)
							{
				if(err)
					{
						console.log(err)
					}
				else
				{
					res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user,error:req.flash("error"),success:req.flash("success")})
					//console.log(currentUser.username)
				}
			})
			//res.render("campground",{campgrounds:campgrounds})
});
//create
router.post("/campgrounds",isLoggedIn,function(req,res)
		{
			//res.send("you have reached the post campgrounds page");
			var name=req.body.name;
			var image=req.body.image;
			var desc=req.body.description;
	var author ={
					id:req.user._id,
					username:req.user.username
				}
			var newCampground={name:name, image:image,description:desc,author:author}
			//console.log(req.user)
			//campgrounds.push(newCampground);
			Campground.create(newCampground,function(err,newCampground)
							 {
				if(err)
					{
						console.log(err);
					}
				else
				{
					console.log(newCampground)
					res.redirect("/campgrounds");
				}
			})
	})	

//new
router.get("/campgrounds/new",isLoggedIn,function(req,res)
	   {
	res.render("campgrounds/new.ejs",{currentUser:req.user,error:req.flash("error"),success:req.flash("success")});
})
//show
router.get("/campgrounds/:id",function(req,res)
	   {
	//We have comments as ids in our DB because of {type:mongoose.Schema.Types.ObjectId, ref:"Comment"} reference association in campgrounds of comments, to have text values of ids we use .populate("comments").exec
	//Find the campground with id
	//req.params.id will get us the id of campground which will be in url after we click on more info
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
					   {
		if(err)
			{
				console.log(err);
			}
		else{
			//console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground,currentUser:req.user,error:req.flash("error"),success:req.flash("success")})
		}
	})
	//req.params.id
	//res.render("show")
})

//Edit route
router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req,res)
	{
		Campground.findById(req.params.id,function(err,foundCampground)
			{
				{
					res.render("campgrounds/edit",{campground:foundCampground,currentUser:req.user,error:req.flash("error"),success:req.flash("success")})
				}
			})
	})

//update route
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res)
		  {
				//find and update the correct campground
				//console.log(campground1)
				Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground)
					{
						if(err)
							{
								res.redirect("/campgrounds")
							}
						else
							{
								console.log(req.body.campground)
								res.redirect("/campgrounds/"+req.params.id)
							}
					 })
		  })

//Delete route
router.delete("/campgrounds/:id",isLoggedIn,checkCampgroundOwnership,function(req,res)
			 {
	Campground.findByIdAndRemove(req.params.id,function(err)
		{
		if(err)
			{
				res.redirect("/campgrounds")
			}
		else{
			
			res.redirect("/campgrounds")
		}
	
})
})

//pass this function to any route you dont want to access without logging in
//Middleware
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error","Please login first!!")
	res.redirect("/login")
}

function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated())
			{
				Campground.findById(req.params.id,function(err,foundCampground)
				 {
					if(err)
					 {
							res.redirect("back")
						}
					else{
					if(foundCampground.author.id.equals(req.user._id))
							{
								console.log(req.user.id)
								console.log(foundCampground.author.id)
								next();
							}
						else{
							res.redirect("back")
							}
						}
				});
			}else{
				res.redirect("back");
			}
}
module.exports = router;
