var express = require("express");
var fs = require("fs");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

router = express.Router();
router.post('/', function(req, res, next){
    var person = req.body.person;
    if (person.split(" ")[1] != user_data[person.split(" ")[0]]["Password"]){
        res.send("Not a valid username or password")
        return;
    }
    var requests_sent = user_data[person.split(" ")[0]].Sent;
    var incoming_reqs = user_data[person.split(" ")[0]].Recieved;
    res.render("incoming", {name: person.split(" ")[0], password: person.split(" ")[1], person: person, req_sent: requests_sent, req_inc: incoming_reqs});

});

module.exports=router;