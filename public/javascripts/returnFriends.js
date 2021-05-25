var fs = require("fs");

//parse the json of the user data file
var friends_dict;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
    friends_dict=JSON.parse(data);
});


//return all the friends
function returnFriends(name){
    var names = [];

    //get the friends of the person
    var name_object = friends_dict[name];

    if (name_object===undefined){
        return undefined;
    } else{
        var users = name_object["Friends"];
    }

    //for each of the names of the friends, add the name to the array
    for (var name=0; name<users.length; name++){
        var user = users[name];
        names.push(user);
    };
    return names
}
module.exports=returnFriends;

