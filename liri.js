var env = require("dotenv").config();
var keys = require("./keys");
var twitter=require("twitter");
// var spotify=require("node-spotify-api");
var request=require("request");
OMDb_API_key="442d59fb";

// var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

temp=process.argv.slice(2);
cmnd=temp[0];
param=temp[1];

switch(cmnd){
    case "my-tweets": twtr();
    //case "movie-this": OMDb(param);
    case "spotify-this": spot();
    case "do-it": doit();
}

function doit(){

}

function spot(){

}

function OMDb(a){
    if(a){
        var title = a.split(" ").join("+");
        //console.log(title);
        request("http://www.omdbapi.com/?t="+title+"&y=&plot=short&apikey="+OMDb_API_key, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("The title is: " + JSON.parse(body).Title);
                console.log("Year of release: " + JSON.parse(body).Year);
                console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(body).tomatoRating);
                console.log("Country of production: "+ JSON.parse(body).Country);
                console.log("Movie language: "+ JSON.parse(body).Language);
                console.log("Plot: "+ JSON.parse(body).Plot);
                console.log("Actors include: "+ JSON.parse(body).Actors);
            }
        });      
    }else{
        console.log("Since you have not entered a movie title, you get stats for Mr. Nobody");
        request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey="+OMDb_API_key, function(error, response, bodyd) {
            console.log("The title is: " + JSON.parse(bodyd).Title);
            console.log("Year of release: " + JSON.parse(bodyd).Year);
            console.log("The movie's rating is: " + JSON.parse(bodyd).imdbRating);
            console.log("Rotten tomatoes rating is: "+ JSON.parse(bodyd).tomatoRating);
            console.log("Country of production: "+ JSON.parse(bodyd).Country);
            console.log("Movie language: "+ JSON.parse(bodyd).Language);
            console.log("Plot: "+ JSON.parse(bodyd).Plot);
            console.log("Actors include: "+ JSON.parse(bodyd).Actors);
        });   
    }
}

function twtr(){
    client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=real_kamran_s&count=5",function(err,bodyt,resp){
        if (!err){bodyt.forEach(twt=>{console.log(twt.text)})}
        else {console.log(resp)}
    })
}