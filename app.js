//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "A blog is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Until 2009, blogs were usually the work of a single individual, occasionally of a small group, and often covered a single subject or topic. In the 2010s, 'multi-author blogs' (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other 'microblogging' systems helps integrate MABs and single-author blogs into the news media. Blog can also be used as a verb, meaning to maintain or add content to a blog."
const aboutContent = "The website is developed by our team keeping in mind that, many people still want to write blogs instead of using twitter. We have kept the UI of the website simple and easy to use so that users don't face any issue when they want to post blogs.";
const contactContent = "You can follow us on our facebook and instagram page 'theironcat'. For any queries, you can mail us on creators@theironcat.com";

const app = express();

mongoose.connect('mongodb+srv://admin-mohit:test123@cluster0.6epds.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", blogSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  Post.find({}, function(err, blogs){
    res.render("home", {startingContent: homeStartingContent,posts: blogs});
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id:requestedId}, function(err,blog){
    if(!err){
        res.render("post", {title:blog.title, content: blog.content});
    }
  });

  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
