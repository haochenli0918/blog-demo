var express = require("express"),
	app = express(),
	//apply when delete and put
	methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	//apply when enter HTML and filter the js code 
	expressSanitizer = require("express-sanitizer"),
	mongoose = require("mongoose");
//build and use db
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchma = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	//default is the result if the user not type in
	created:{type: Date, default: Date.now}
});
//build collections named blog in restful_blog_app db
var blog = mongoose.model("Blog", blogSchma);


//RESTFUL ROUTES

// blog.create({
// 	title:"Test fig", 
// 	image: "https://m.media-amazon.com/images/I/511LCj4HF2L._SL320_.jpg",
// 	body:"this is a test sample"
// });
//INDEX
app.get("/", function(req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
	//find all data from db, notice that send all blogs body as well as their id
		blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {blogs:blogs});
		}
	});
	// res.send("hi there");
});
//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
})

//CREATE ROUTE
app.post("/blogs", function(req, res){
	// create blog
	// console.log(req.body.blog.body);
	// console.log("=================");
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// console.log(req.body.blog.body);
	//get the content of the blog and generate one id on the serverside
	blog.create(req.body.blog, function(err, newele){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	})
});
// title 
// image
// body
// created

//SHOW ROUTE
app.get("/blogs/:tempid", function(req, res){
	// res.send("show page");
	//the following tempid comes from /blogs/:tempid, when click the url of /blogs/:tempid and make a request, then request.params has one value of this tempid
	blog.findById(req.params.tempid, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog:foundBlog});
		}		  
	});
});

//EDIT ROUTE show edit view only
app.get("/blogs/:id/edit",function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs/");
		}else{
			res.render("edit", {blog:foundBlog});
		}
});
});

//UPDATE ROUTE 
app.put("/blogs/:id", function(req, res){
	blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblod){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	// res.send("you have reached the destroy route");
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});




app.listen(3000, function(){
	console.log("the server is running");
});