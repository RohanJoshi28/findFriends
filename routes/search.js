//handler for when the user searches up names to send friend requests to

var express = require("express");
var fs = require("fs");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
});

var router=express.Router();

router.post("/", function(req, res, next){

    //the names found that correspond to the user's search
    var names_found = [];

    //the current user's info
    var person = req.body.person;

    //the user's search (its usually a part of a username or a full username)
    var part = req.body.person_part;

    //all the names in the json file on the data of all users
    var names = Object.keys(user_data);

    //the user's current friends
    var current_friends = user_data[person.split(" ")[0]]["Friends"]

    //iterate through all the names in the json file
    for (var i=0; i<names.length; i++){

        //if the name corresponds to the user's search (For example "Rohan" corresponds to "Ro")
        if (names[i].toLowerCase().includes(part.toLowerCase()) && names[i]!==person.split(" ")[0] && !(current_friends.includes(names[i]))){
            //add the name to the names that correspond with the search for display to the user
            names_found.push(names[i]);
        }
    }

    //render the page that shows all the names found that correspond to the user's search (search results)
    res.render("search.hbs", {name: person.split(" ")[0], password: person.split(" ")[1], person: person, found: names_found});
});

module.exports=router; 