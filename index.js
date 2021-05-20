const twitter = require("twitter")
const fs = require('fs');
const config = require("./config.json")

let client = new twitter({
    consumer_key: config.consumer_key,
    consumer_secret:config.consumer_secret,
    access_token_key:config.access_token_key,
    access_token_secret:config.access_token_secret
})
function getID(userName){
    let params = {q:userName}
    client.get("users/search",params,function(error,users,response){
    if(!error){
        console.log("Searching suspects followers for @"+users[0].screen_name)
        return users[0].id_str;
    } else {
        console.log("error")
        console.log(error)
    }
})
}

function searchSuspect(UserName){
    let params = {user_id:getID(UserName),count:200};
    client.get('followers/list', params, function(error, users, response) {
    if (!error) {
        for(i=0;i<users.users.length;i++){
            if(isSuspect(users.users[i].description)){
                console.log(users.users[i].screen_name+" is suspect");
                addSuspect(users.users[i].screen_name);
            }
        }
    } else {
        console.log("error :(")
        console.log(error);
    }
    });
}

function isSuspect(description){
    return (description.includes("12") 
    || description.includes("13") 
    || description.includes("14") 
    || description.includes("15") 
    || description.includes("16"))
}
function addSuspect(suspect){
    fs.appendFile('suspects.txt', suspect+'\n', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}
searchSuspect("Horse_zoo")