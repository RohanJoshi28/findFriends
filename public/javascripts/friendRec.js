var fs = require("fs");
var getFriends = require("./returnFriends");

function friendRecs(person){
    var friend_recs = [];
    //get the current friends of the person
    current_friends = getFriends(person);

    for (var friend=0; friend<current_friends.length; friend++){
        //for each of those friends, get all of their friends
        var new_friends = getFriends(current_friends[friend]);
        //if that friend has no friends of their own, continue the loop
        if (new_friends===undefined){
            continue;
        } else{

            //otherwise for each of those new friends 
            for (var next_friend=0; next_friend<new_friends.length; next_friend++){
                possible_friend = new_friends[next_friend];

                //check if those friends are the original person or the original person's friends
                if (possible_friend!==person && !(current_friends.includes(possible_friend)) && !(friend_recs.includes(possible_friend))){

                    //if not, then you can add that friend to recommendations
                    friend_recs.push(possible_friend);
                }
            }
        }
    }
    return friend_recs;
}

module.exports = friendRecs; 