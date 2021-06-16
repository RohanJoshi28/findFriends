var express = require("express");
var router = express.Router();
var fs = require("fs"); 

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

//read the data for all posts in the database
var comments_data;
fs.readFile("./public/javascripts/comments.json", (err, data)=>{
  comments_data = JSON.parse(data);
})

//this happens when a user clicks on his/her own or someone else's post
router.post('/', function(req, res, next){
    //get the user who created the post
    var post_username = req.body.post_username;

    //this is for when the user wants to comment on a post
    if (req.body.new_comment!==undefined){

        var post_id = req.body.post_id;
        comments_data[post_id].push(req.body.new_comment);

        fs.writeFile("./public/javascripts/comments.json", JSON.stringify(comments_data), function(err){
            if (err){throw err};
        });
        //this is for when the user just wants to view the post
    } else {
        var post_num = req.body.index; 
        var post_id = user_data[post_username].Posts[post_num];
    }

    var post_text = post_data[post_id];

    var comments = comments_data[post_id];

    //render post page so that the user can see the post and comment on it
    res.render("post", {post_username: post_username, post_id: post_id, post_text: post_text, comments: comments});
});

module.exports=router;