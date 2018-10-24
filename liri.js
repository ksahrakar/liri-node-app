var env = require("dotenv").config();
var keys = require("./keys");
var twitter=require("twitter");
var spotify=require("node-spotify-api");
var request=require("request");
var moment=require("moment");
var fs=require("fs");

var spoti = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
const OMDb_API_key = keys.OMDb.OMDb_API_key;
const BIT_key = keys.bit.BIT_key;

temp=process.argv.slice(2);
cmnd=temp[0];
param=temp[1];

switch(cmnd){
    case "my-tweets": twtr(param);break;
    case "movie-this": OMDb(param);break;
    case "spotify-this": spot(param);break;
    case "concert-this": bandsiT(param);break;
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
                case "concert-this": bandsiT(param);break;
                case "spotify-this": spot(param);break;
            }
        }
    });
    
}

function spot(a){
    if(a){
        var title = param;
        //console.log(title);
        spoti.search({type:"track",query:title,limit:5}, function(error, body) {
            if (!error) {
                //console.log(body.tracks.items.length);
                console.log("These are the top five search results");
                console.log("---------------------");
                for (i=0;i<5;i++){
                    console.log("The song title is: " + body.tracks.items[i].name);
                    console.log("The artist is: " + body.tracks.items[i].album.artists[0].name);
                    console.log("The album name is: " + body.tracks.items[i].album.name);
                    console.log("Date of release: " + body.tracks.items[i].album.release_date);
                    console.log("Preview at: " + body.tracks.items[i].album.external_urls.spotify);
                    console.log("----------------------");
                }
            } else if (error==undefined){console.log("I couldn't find a track with that name")}
        });      
    }else{
        console.log("Since you have not entered a track title, you get stats for 'The Sign'");
        spoti.search({type:"track",query:"The Sign",artist:"ace of base"}, function(error, response, bodyd) {
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
            if (!error && response.statusCode === 200 && !(JSON.parse(body).Title==undefined)) {
                console.log("The title is: " + JSON.parse(body).Title);
                console.log("Year of release: " + JSON.parse(body).Year);
                console.log("The movie's IMDb rating is: " + JSON.parse(body).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(body).Ratings[1].Value);
                console.log("Country of production: "+ JSON.parse(body).Country);
                console.log("Movie language: "+ JSON.parse(body).Language);
                console.log("Plot: "+ JSON.parse(body).Plot);
                console.log("Actors include: "+ JSON.parse(body).Actors);
            }else {console.log("I couldn't find a movie with that name")}
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

function bandsiT(a){
    if(a){
        var fartist = a.split(" ").join("+");
        request("https://rest.bandsintown.com/artists/"+fartist+"/events?app_id="+BIT_key, function(error, response, bodyb) {
            if (!error && !(JSON.parse(bodyb)[0]==undefined)) {
                console.log("-----UPCOMING SHOWS-----");
                console.log("------------------------");
                fs.appendFile("reqlog.txt","-----Console command: "+temp+"-----\r\n"+"-----"+fartist.split("+").join(' ')+" performances found"+"-----"+"\r\n", function(err){
                    if (err) {console.log(err)}
                });
                for (i=0;i<JSON.parse(bodyb).length;i++){
                    console.log("The venue: " + JSON.parse(bodyb)[i].venue.name);
                    console.log("Location: " + JSON.parse(bodyb)[i].venue.city);
                    console.log("Date: " + moment(JSON.parse(bodyb)[i].datetime).format("MM/DD/YYYY"));
                    console.log("-------------------------------");
                    fs.appendFile("reqlog.txt", JSON.parse(bodyb)[i].venue.name+','+JSON.parse(bodyb)[i].venue.city+','+moment(JSON.parse(bodyb)[i].datetime).format("MM/DD/YYYY")+'\r\n', function(err) {if (err) {console.log(err)}
                    });
                }
            } else {console.log("I couldn't find an upcoming venue")}
        });      
    }else{console.log("No artist to search for");}   
}
