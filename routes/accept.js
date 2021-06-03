var express=require("express");
var router = express.Router();
var fs = require("fs");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

router.post("/", function(req,res,next){
    //get the person sending the friend requests
    var username = req.body.username;
    var password = req.body.password;

    //if the username and password in the url are not correct, send invalid username or password error
    if (password != user_data[username]["Password"]){
        res.send("Not a valid username or password")
        return;
    }

    //get the queries of the request (including the person sending it and the friend requests accepted)
    var req_queries = Object.keys(req.body);

    console.log(req_queries)

    //get all friend requests accepted
    var friend_reqs_on = [];
    for (var i=0; i<req_queries.length; i++){
        if (req_queries[i]==="username" || req_queries[i]==="password"){
            continue; 
        } else if (req.body[req_queries[i]]=="on"){
            friend_reqs_on.push(req_queries[i]);
        }
    }

    console.log(friend_reqs_on);

    //iterate over each friend request accepted
    for (var i=0; i<friend_reqs_on.length; i++){

        //remove the user from the friend's "sent" array
        user_data[friend_reqs_on[i]]["Sent"] = user_data[friend_reqs_on[i]]["Sent"].filter(function(value, index, arr){
            return value!=username;
        });

        //remove the friend from the user's "recieved" array
        user_data[username]["Recieved"] = user_data[username]["Recieved"].filter(function(value, index, arr){
            return !(friend_reqs_on.includes(value));
        });

        //add them as each other's friends
        user_data[username]["Friends"].push(friend_reqs_on[i]);
        user_data[friend_reqs_on[i]]["Friends"].push(username)
    }

    //write the new json file to memory
    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(user_data), function(err){
        if (err){throw err};
    });

    //show the user who's friend requests they accepted
    res.render("accepted.hbs", {username: username, password: password, people: friend_reqs_on});

});

module.exports=router;