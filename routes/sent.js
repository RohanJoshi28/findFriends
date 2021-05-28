//handler for once the user sends friend requests to people

var express=require("express");
var fs=require("fs");

//get the user data json file and store it in the variable friend reqs
var friend_reqs;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
    friend_reqs = JSON.parse(data);
});

router = express.Router();

router.post('/', function(req, res, sent){
    //the request body from the POST request that is sent to be handled here
    var query = req.body;

    //the person who sent that post request
    var person = query.person;

    //make sure the username and password in the post request are correct
    if (friend_reqs[person.split(" ")[0]]["Password"]!==person.split(" ")[1]){
        res.send("Invalid Request, not correct password");
        return;
    } 

    //get the keys of the request's query
    var req_queries = Object.keys(query);

    //people the friend requests are sent to
    var friend_reqs_on=[];

    //iterate through the request's queries
    for (var i=0; i<req_queries.length; i++){

        //if the query key is "person", it is irrelevant. 
        if (req_queries[i]==="person"){
            continue;
        //The inputs for friend request form are checkboxes, so each is either on or off
        } else if (query[req_queries[i]]==="on"){
            //if the user sent a friend request to that person, so append that person to var friend_reqs_on
            friend_reqs_on.push(req_queries[i])
            //The person who this friend request was sent to adds the user to their "Recieved" list
            friend_reqs[req_queries[i]]["Recieved"].push(person.split(" ")[0]);
        }
    }

    //All the people the user has sent friend requests to are added to the users "Sent" list
    friend_reqs[person.split(" ")[0]]["Sent"] = Array.prototype.concat(friend_reqs[person.split(" ")[0]]["Sent"], friend_reqs_on)

    //update the main user data json file
    fs.writeFile("./public/javascripts/user_data.json", JSON.stringify(friend_reqs), function(err){
        if (err){throw err};
    });

    //render the page where the website tells the user friend requests have been sent successfully
    res.render("sent", {name: person.split(" ")[0], password: person.split(" ")[1]});
    
});

module.exports=router;