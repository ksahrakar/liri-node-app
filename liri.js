var env = require("dotenv").config();
var keys = require("./keys");
var twitter=require("twitter");
var spotify=require("node-spotify-api");
var request=require("request");
var fs=require("fs");


var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
const OMDb_API_key = keys.OMDb.OMDb_API_key;

temp=process.argv.slice(2);
cmnd=temp[0];
param=temp[1];

switch(cmnd){
    case "my-tweets": twtr(param);break;
    case "movie-this": OMDb(param);break;
    case "spotify-this": spot(param);break;
    case "do-it": doit();break;
}

function doit(){
    // Read file first
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }else{
            var dataArr = data.split(",");
            param=dataArr[1].replace(/^"(.*)"$/, '$1');
            var x=dataArr[0];
            //console.log(x+param);
            switch(x){
                case "my-tweets": twtr(param);break;
                case "movie-this": OMDb(param);break;
                case "spotify-this": spot(param);break;
            }
        }
    });
    
}

function spot(a){
    if(a){
        var title = param;
        //console.log(title);
        spotify.search({type:"track",query:title}, function(error, body) {
            if (!error) {
                //console.log(body.tracks.items[0].name);
                console.log("The song title is: " + body.tracks.items[0].name);
                console.log("The artist is: " + body.tracks.items[0].album.artists[0].name);
                console.log("The album name is: " + body.tracks.items[0].album.name);
                console.log("Date of release: " + body.tracks.items[0].album.release_date);
                console.log("Preview at: " + body.tracks.items[0].album.external_urls.spotify);
            } else if (body==undefined){console.log("I couldn't find a track with that name")}
        });      
    }else{
        console.log("Since you have not entered a track title, you get stats for 'The Sign'");
        spotify.search({type:"track",query:"The Sign",artist:"ace of base"}, function(error, response, bodyd) {
            if (!error) {
                console.log("The song title is: " + bodyd.tracks.items[0].name);
                console.log("The artist is: " + bodyd.tracks.items[0].album.artists[0].name);
                console.log("The album name is: " + bodyd.tracks.items[0].album.name);
                console.log("Date of release: " + bodyd.tracks.items[0].album.release_date);
                console.log("Preview at: " + bodyd.tracks.items[0].album.external_urls.spotify);
            }
        });   
    }
}

function OMDb(a){
    if(a){
        var title = a.split(" ").join("+");
        //console.log(title);
        request("http://www.omdbapi.com/?t="+title+"&y=&tomatoes=True&plot=short&apikey="+OMDb_API_key, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("The title is: " + JSON.parse(body).Title);
                console.log("Year of release: " + JSON.parse(body).Year);
                console.log("The movie's IMDb rating is: " + JSON.parse(body).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(body).Ratings[1].Value);
                console.log("Country of production: "+ JSON.parse(body).Country);
                console.log("Movie language: "+ JSON.parse(body).Language);
                console.log("Plot: "+ JSON.parse(body).Plot);
                console.log("Actors include: "+ JSON.parse(body).Actors);
            } else {console.log("I couldn't find a movie with that name")}
        });      
    }else{
        console.log("Since you have not entered a movie title, you get stats for Mr. Nobody");
        request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey="+OMDb_API_key, function(error, response, bodyd) {
            if (!error && response.statusCode === 200) {
                console.log("The title is: " + JSON.parse(bodyd).Title);
                console.log("Year of release: " + JSON.parse(bodyd).Year);
                console.log("The movie's IMDb rating is: " + JSON.parse(bodyd).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(bodyd).Ratings[1].Value);
                console.log("Country of production: "+ JSON.parse(bodyd).Country);
                console.log("Movie language: "+ JSON.parse(bodyd).Language);
                console.log("Plot: "+ JSON.parse(bodyd).Plot);
                console.log("Actors include: "+ JSON.parse(bodyd).Actors);
            }
        });   
    }
}

function twtr(a){
    client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=real_kamran_s&count="+a,function(err,bodyt,resp){
        if (!err){bodyt.forEach(twt=>{console.log(twt.text)})}
        else {console.log(resp)}
    })
}