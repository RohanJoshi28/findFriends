var fs = require("fs");
var getFriends = require("./returnFriends");
var spacy = require("spacy");

//read the data for all people in the database
var user_data;
fs.readFile("./public/javascripts/user_data.json", (err, data)=>{
  user_data = JSON.parse(data);
})

async function simplifyDoc(doc){
    for (var token of doc.tokens){
        if (token.isStop!==undefined){
            if (token.isStop===true){
                token.textWithWs = "";
            } else{
                token.textWithWs = token.textWithWs.replace(token.text, token.lemma);
            }
        }
    }
}

//function to take in biography 1, biography 2, and the nlp model to return similarity
async function findSimilarity(text1, text2, model){
    doc1 = await model(text1);
    doc2 = await model(text2)

    await simplifyDoc(doc1);
    await simplifyDoc(doc2);

    similarity = await doc1.similarity(doc2);
    return similarity;
}

//asynchronus friend recommendation function
async function friendRecs(person){
    
    var friend_recs = [];

    var person_info = user_data[person];

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
                if (possible_friend!==person && !(current_friends.includes(possible_friend)) && !(friend_recs.includes(possible_friend)) && !(person_info.Sent.includes(possible_friend)) && !(person_info.Recieved.includes(possible_friend))){

                    //if not, then you can add that friend to recommendations
                    friend_recs.push(possible_friend);
                }
            }
        }
    }

    //load the nlp model
    const model = spacy.default.load("en_core_web_sm");

    //the user's biography
    var person_bio = user_data[person].Bio;

    //the similarities between user's biography and the recommended friends' biography
    var similarities = [];

    //iterates over each of the friends to find the similarity between the user and the friend to append it
    for (var friend=0; friend<friend_recs.length; friend++){
        friend_bio = user_data[friend_recs[friend]].Bio;

        similarity = await findSimilarity(person_bio, friend_bio, model);
        similarities.push(similarity);
    }

    //sorts the recommended friends based on the similarities from largest to smallest, using insertion sort
    for (var i=0; i<similarities.length; i++){
        for (var j=i+1; j<similarities.length; j--){
            if (similarities[i]<similarities[j]){
                var temp = similarities[i]
                similarities[i] = similarities[j];
                similarities[j] = temp;
        
                temp = friend_recs[i];
                friend_recs[i] = friend_recs[j];
                friend_recs[j] = temp;
            } else{
                break;
            }
        }
    }

    //returns recommended friends
    return friend_recs;

}


module.exports = friendRecs; 