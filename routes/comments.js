var express = require("express");
var router  = express.Router()

var Campground = require("../models/campground");
var Comment    = require("../models/comment")

//=================================================================================
//COMMENTS ROUTE
//=================================================================================
//NEW route which will display the form
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res)
	   {
	//res.send("This will be the form");
	Campground.findById(req.params.id,function(err,campground)
					   {
		if(err)
			{
				console.log(err)
			}
		else{
				res.render("comments/new",{campground:campground,currentUser:req.user,error:req.flash("error"),success:req.flash("success")})
		}
	})
})

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res)
		{
	//lookup campground using id
	//Create new comment
	//connect new comment to campground
	//redirect to campground show page
	Campground.findById(req.params.id,function(err,campground)
					   {
		if(err)
			{
				console.log(err)
			}
		else{
			var text=req.body.commentText;
			var author=req.body.author;
			var newComment={text:text,author:author}
			Comment.create(newComment,function(err,comment)
						  {
				if(err)
					{
						console.log(err)
					}
				else{
					//add username and id to the comment
					comment.author.id       = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//console.log("username of the person adding this comment will be " + req.user.username)
					//Pushing our comment to the correct campground
					campground.comments.push(comment);
					//campground and comment here refers to the campground and comment in line 125 and 142
					campground.save();
					req.flash("success","Successly added your comment")
					res.redirect("/campgrounds/"+req.params.id);
				}
			})
		}
	})
})
//Edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit",isLoggedIn,checkCommentOwnership,function(req,res)
		  {
	//const campground_id=req.params.id;
	Comment.findById(req.params.comment_id,function(err,foundComment)
		{
			if(err)
				{
					res.redirect("/index")
				}
		else{
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment,currentUser:req.user,error:req.flash("error"),success:req.flash("success")})
		}
		})
})
//comments update route
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,isLoggedIn,function(req,res)
		  {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
		{
			if(err)
				{
					res.redirect("back")
				}
		else{
				//console.log(req.body.commentText)
				//console.log(updatedComment.text)
				res.redirect("/campgrounds/" + req.params.id)
		}
	})
})


//Comments Delete route
router.delete("/campgrounds/:id/comments/:comment_id",isLoggedIn,checkCommentOwnership,function(req,res)
			 {
	Comment.findByIdAndRemove(req.params.comment_id,function(err)
							 {
		if(err){res.redirect("/campgrounds")}
		req.flash("seccess","Comment deleted")
		res.redirect("/campgrounds/" + req.params.id)
	})
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

function checkCommentOwnership(req,res,next)
{
	if(req.isAuthenticated)
		{
			Comment.findById(req.params.comment_id,function(err,foundComment)
			{
				if(foundComment.author.id.equals(req.user._id))
				   {
					   //console.log(req.user.id)
					   //console.log(foundComment.author.id)
						next();
				   }	
				else{
					res.redirect("back")
					//console.log(req.user.id)
					//console.log(foundComment.author.id)
				}
			})
		}
		else
		{
			req.flash("error","You should login before adding a comment")
			res.redirect("back")
		}
}

module.exports = router;