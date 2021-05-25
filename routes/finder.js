//this is the page people go to find their friends after they have logged in

var express = require('express');

//import the function to get the current friends and get the friend recommendations
var findFriends = require('../public/javascripts/returnFriends');
var getRecs = require("../public/javascripts/friendRec");

var router = express.Router();
var fs = require("fs");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

/* GET home page. */
router.post('/', function(req, res, next) {
  //find the friends of the person who has logged in
  response = findFriends([req.body.name])

  //if the person who logged in doesn't exist, tell the user that they entered the wrong username/password
  if (response===undefined || user_data[req.body.name]["Password"]!=req.body.password){
    if (req.body.account==="log in"){
      res.render("login", {invalid: true})  
    } else if (req.body.account=="sign up"){

        //one reason the user does not exist is because they decided to sign up, so create a new database entry
        var new_login_info = req.body.name;
        user_data[new_login_info] = {"Friends": [], "Password": req.body.password};
        fs.writeFile("C:/Users/ajosh/findFriends/findFriends/public/javascripts/user_data.json", JSON.stringify(user_data), function(err){
          if (err){ throw err}
          else {console.log("added user")}
        })
        res.render("login");
    }
  } else {
      //simply render the friends and the friend recommendations
      var info = req.body.name;
      var info_pass = req.body.name + " " + req.body.password;
      res.render('finder', { person: info_pass, friends: findFriends([info]), friendRecs: getRecs(info)});
  }
});

module.exports = router;