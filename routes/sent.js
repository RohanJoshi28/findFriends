var express=require("express");
var fs=require("fs");

var friend_reqs;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
    friend_reqs = JSON.parse(data);
});

router = express.Router();

router.post('/', function(req, res, sent){
    var query = req.body;
    var person = query.person;
    if (friend_reqs[person.split(" ")[0]]["Password"]!==person.split(" ")[1]){
        res.send("Invalid Request, not correct password");
        return;
    } 
    var req_queries = Object.keys(query);

    var friend_reqs_on=[];
    for (var i=0; i<req_queries.length; i++){
        if (req_queries[i]==="person"){
            continue;
        } else if (query[req_queries[i]]==="on"){
            friend_reqs_on.push(req_queries[i])
            console.log(friend_reqs[req_queries[i]]);
            friend_reqs[req_queries[i]]["Recieved"].push(person.split(" ")[0]);
        }
    }

    friend_reqs[person.split(" ")[0]]["Sent"] = Array.prototype.concat(friend_reqs[person.split(" ")[0]]["Sent"], friend_reqs_on)

    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(friend_reqs), function(err){
        if (err){throw err};
    });

    res.render("sent", {name: person.split(" ")[0], password: person.split(" ")[1]});
    
});

module.exports=router;