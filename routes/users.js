var express = require('express');
var fs = require("fs");
var router = express.Router();

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

//read the data for all posts in the database
var post_data;
fs.readFile("./public/javascripts/post_id.json", (err, data)=>{
  post_data = JSON.parse(data);
})

//read the data for all comments in the database
var comments_data;
fs.readFile("./public/javascripts/comments.json", (err, data)=>{
  comments_data = JSON.parse(data);
})


function get_post_text (posts) {
  var post_text = []
  for (var i=0; i<posts.length; i++){
    var current_id = posts[i];
    post_text.push(post_data[current_id]);
  }
  return post_text; 
}

/* GET users listing. */
router.get('/:person', function(req, res, next) {

  // get the information from user data and display it
  var username = req.params.person;
  var bio = user_data[username].Bio;
  var phone = user_data[username].Phone;
  var posts = user_data[username].Posts; 

  var post_text = get_post_text(posts);

  res.render("users", {username: username, bio: bio, phone: phone, posts: post_text, edit: false});

});

//if the user is looking at their own profile
router.post("/", function(req, res, next){

  //get the username and password to validate it
  var username = req.body.username; 

  var password = req.body.password;
  var bio = user_data[username].Bio;

  var phone = user_data[username].Phone;
  var posts = user_data[username].Posts;
  var post_text = get_post_text(posts);


  if (password!==user_data[username].Password){
    res.send("That username does not match the password");
  } 
  
  //if the "update" hidden input is there, then update the user's bio
  else if (req.body.update==="update"){

    user_data[username].Bio = req.body.bio;
    //update the main user data json file
    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(user_data), function(err){
        if (err){throw err};
    });
    bio = user_data[username].Bio;
    phone = user_data[username].Phone;
    res.render("users", {username: username, password: password, bio: bio, phone: phone, posts: post_text, edit: true});

  } 

  //if the "create" hidden input is there, the the purpose of the request is to create a new user post. 

  else if (req.body.create=="create"){

    var current_id = post_data.current_post_id;
    var new_post = req.body.new_post;

    user_data[username].Posts.push(current_id);
    post_data[current_id] = new_post;
    post_data["current_post_id"]+=1;

    //new comment thread
    comments_data[current_id] = [];

    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(user_data), function(err){
      if (err){throw err};
    });

    fs.writeFile("./public/javascripts/post_id.json", JSON.stringify(post_data), function(err){
      if (err){throw err};
    });

    fs.writeFile("./public/javascripts/comments.json", JSON.stringify(comments_data), function(err){
      if (err){throw err};
    });

    posts = user_data[username].Posts;
    post_text = get_post_text(posts);

    res.render("users", {username: username, password: password, bio: bio, phone: phone, posts: post_text, edit: true});

  }

  //if someone wants to delete a post
  else if (req.body.delete==="delete"){
    //which post does the user want to delete, for example the user's nth post. 
    var post_num = req.body.post_num;

    //the id of that post
    var post_id = user_data[username].Posts[post_num];

    //remove that post from the user and database
    user_data[username].Posts.splice(post_num, 1);
    delete post_data[post_id];

    delete comments_data[post_id];

    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(user_data), function(err){
      if (err){throw err};
    });

    fs.writeFile("./public/javascripts/post_id.json", JSON.stringify(post_data), function(err){
      if (err){throw err};
    });

    fs.writeFile("./public/javascripts/comments.json", JSON.stringify(comments_data), function(err){
      if (err){throw err};
    });

    posts = user_data[username].Posts;
    post_text = get_post_text(posts);

    res.render("users", {username: username, password: password, bio: bio, phone: phone, posts: post_text, edit: true});

  }
  
  //otherwise, just show the user's profile and give them the option to edit it
  else{

    res.render("users", {username: username, password: password, bio: bio, phone: phone, posts: post_text, edit: true});

  }

})

module.exports = router;
