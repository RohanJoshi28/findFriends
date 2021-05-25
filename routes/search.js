var express = require("express");
var fs = require("fs");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
});

var router=express.Router();

router.post("/", function(req, res, next){
    var names_found = [];
    var person = req.body.person;
    var part = req.body.person_part;
    var names = Object.keys(user_data);
    var current_friends = user_data[person.split(" ")[0]]["Friends"]
    for (var i=0; i<names.length; i++){
        if (names[i].toLowerCase().includes(part.toLowerCase()) && names[i]!==person.split(" ")[0] && !(current_friends.includes(names[i]))){
            names_found.push(names[i]);
        }
    }
    res.render("search.hbs", {name: person.split(" ")[0], password: person.split(" ")[1], person: person, found: names_found});
});

module.exports=router;