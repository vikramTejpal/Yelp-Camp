This is the whole working of the yelp camp,first of all we use node js to create our application in ehich we install various packages according to their functionalities, the very important being the express.
we install express 



var express=require("express");
var app=express();
app.set("view engine","ejs")
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))


var campgrounds=[
		{
			name:"Salman Creek", image:"https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073__340.png"
		},
		{
			name:"Granite Hill", image:"https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275__340.jpg"
		},
		{
			name:"Mountain Goat is Rest", image:"https://cdn.pixabay.com/photo/2016/11/21/14/31/vw-bus-1845719__340.jpg"
		}
	];

app.get("/",function(req,res)
	   {
			res.render("landing");
})

app.get("/campgrounds",function(req,res)
	   {
	
			res.render("campground",{campgrounds:campgrounds})
});

app.post("/campgrounds",function(req,res)
		{
			//res.send("you have reached the post campgrounds page");
			var name=req.body.name;
			var image=req.body.image;
			var newCampground={name:name, image:image}
			campgrounds.push(newCampground);
			res.redirect("/campgrounds");
})


app.get("/campgrounds/new",function(req,res)
	   {
	res.render("new.ejs");
})
app.listen(3000,function()
	{
		console.log("Yelp Camp Server Started At Port Number 3000");	
	})
	
	
	
	
	
	
//RESTFUL ROUTES
=======================================================
	name        url                        verb      desc
	
1)  INDEX       "/dogs"                    GET       Shows all the dogs in our DB
2)  NEW         "/dogs/new"                GET       Displays form to make a new dog
3)  CREATE      "/dogs"                    POST      Adds a new dog to the DB
4)  SHOW        "/dogs/:id"                GET       Shows info about one dog



