var express = require('express');
var fs = require("fs");
var router = express.Router();

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

/* GET users listing. */
router.get('/:person', function(req, res, next) {

  // get the information from user data and display it

  var person = req.params.person;
  var bio = user_data[person].Bio;
  var phone = user_data[person].Phone;
  
  res.render("users", {name: person, bio: bio, phone: phone, self: false});
});

//if the user is looking at their own profile
router.post("/", function(req, res, next){

  //get the username and password to validate it
  var username = req.body.username; 
  var password = req.body.password;

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
    var bio = user_data[username].Bio;
    var phone = user_data[username].Phone;
    res.render("users", {username: username, password: password, bio: bio, phone: phone, self: true});

  } 
  
  //otherwise, just show the user's profile and give them the option to edit it
  else{

    var bio = user_data[username].Bio;
    var phone = user_data[username].Phone;
    res.render("users", {username: username, password: password, bio: bio, phone: phone, self: true});

  }
  
})

module.exports = router;
