var env = require("dotenv").config();
var keys = require("./keys");
var twitter=require("twitter");
var spotify=require("node-spotify-api");
var request=require("request");
var moment=require("moment");
var fs=require("fs");
var inquirer = require("inquirer");


var spoti = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
const OMDb_API_key = keys.OMDb.OMDb_API_key;
const BIT_key = keys.bit.BIT_key;

// temp=process.argv.slice(2);
// cmnd=temp[0];
// param=temp[1];
var cmnd;
var param;

var inquirer = require("inquirer");

// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    {
      type: "list",
      message: "What do you want to do?",
      choices: ["my-tweets", "movie-this", "spotify-this","concert-this","do-it","exit"],
      name: "choices",
    }
  ])
  .then(function(inqResp) {
    switch (inqResp.choices) {
        case "my-tweets": cmnd="my-tweets";inquirer.prompt([{type:"input",message:"How many?(Default=1)",name:"numb",default:1}]).then(function(inqRespT){param=parseInt(inqRespT.numb);twtr(param)});break;
        case "movie-this": cmnd="movie-this";inquirer.prompt([{type:"input",message:"What movie title?",name:"mTitle"}]).then(function(inqRespM){param=inqRespM.mTitle.split(" ").join("+");OMDb(param)});break;
        case "spotify-this": cmnd="spotify-this";inquirer.prompt([{type:"input",message:"What track title?",name:"tTitle"}]).then(function(inqRespT){param=inqRespT.tTitle;spot(param)});break;
        case "concert-this":cmnd="concert-this";inquirer.prompt([{type:"input",message:"What artist?",name:"cTitle"}]).then(function(inqRespC){param=inqRespC.cTitle.split(" ").join("+");bandsiT(param)});break;
        case "do-it":cmnd="do-it";doit();break;
        case "exit": console.log("OK, we won't proceed; have a great day!");break;
    }
});

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
        spoti.search({type:"track",query:a,limit:5}, function(error, body) {
            var temp = "'node liri', then '"+cmnd+"' then '"+a+"'";
            if (!error) {
                fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"-----Top 5 tracks found for "+a+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
                console.log("These are the top five search results");
                console.log("---------------------");
                for (i=0;i<5;i++){
                    console.log("The song title is: " + body.tracks.items[i].name);
                    console.log("The artist is: " + body.tracks.items[i].album.artists[0].name);
                    console.log("The album name is: " + body.tracks.items[i].album.name);
                    console.log("Date of release: " + body.tracks.items[i].album.release_date);
                    console.log("Preview at: " + body.tracks.items[i].album.external_urls.spotify);
                    console.log("----------------------");
                    fs.appendFile("reqlog.txt", body.tracks.items[i].name+','+body.tracks.items[i].album.artists[0].name+','+body.tracks.items[i].album.name+','+body.tracks.items[i].album.release_date+','+'\r\n'+body.tracks.items[i].album.external_urls.spotify+'\r\n'+'------------', function(err) {if (err) {console.log(err)}});
                }
            } else if (error==undefined){console.log("I couldn't find a track with that name")}
        });      
    }else{
        console.log("Since you have not entered a track title, you get stats for 'The Sign'");
        spoti.search({type:"track",query:"The Sign",artist:"ace of base"}, function(error, response, bodyd) {
            var temp = "'node liri', then '"+cmnd+"' then '"+a+"'";
            if (!error) {
                fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"-----"+a+" track found"+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
                console.log("The song title is: " + bodyd.tracks.items[0].name);
                console.log("The artist is: " + bodyd.tracks.items[0].album.artists[0].name);
                console.log("The album name is: " + bodyd.tracks.items[0].album.name);
                console.log("Date of release: " + bodyd.tracks.items[0].album.release_date);
                console.log("Preview at: " + bodyd.tracks.items[0].album.external_urls.spotify);
                fs.appendFile("reqlog.txt", bodyd.tracks.items[i].name+','+bodyd.tracks.items[i].album.artists[0].name+','+bodyd.tracks.items[i].album.name+','+bodyd.tracks.items[i].album.release_date+','+'\r\n'+bodyd.tracks.items[i].album.external_urls.spotify+'\r\n'+'------------', function(err) {if (err) {console.log(err)}});
            }
        });   
    }
}

function OMDb(a){
    if(a){
        var temp = "'node liri', then '"+cmnd+"' then '"+a.split("+").join(" ")+"'";
        request("http://www.omdbapi.com/?t="+a+"&y=&tomatoes=True&plot=short&apikey="+OMDb_API_key, function(error, response, body) {
            if (!error && response.statusCode === 200 && !(JSON.parse(body).Title==undefined)) {
                fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"-----"+a.split("+").join(' ')+" movie found"+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
                console.log("The title is: " + JSON.parse(body).Title);
                console.log("Year of release: " + JSON.parse(body).Year);
                console.log("The movie's IMDb rating is: " + JSON.parse(body).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(body).Ratings[1].Value);
                console.log("Country of production: "+ JSON.parse(body).Country);
                console.log("Movie language: "+ JSON.parse(body).Language);
                console.log("Plot: "+ JSON.parse(body).Plot);
                console.log("Actors include: "+ JSON.parse(body).Actors);
                fs.appendFile("reqlog.txt", JSON.parse(body).Title+','+JSON.parse(body).imdbRating+','+JSON.parse(body).Ratings[1].Value+','+JSON.parse(body).Country+',\r\n'+JSON.parse(body).Language+','+'\r\n'+JSON.parse(body).Plot+','+'\r\n'+JSON.parse(body).Actors+'\r\n', function(err) {if (err) {console.log(err)}});
            }else {console.log("I couldn't find a movie with that name")}
        });      
    }else{
        console.log("Since you have not entered a movie title, you get stats for Mr. Nobody");
        var temp = "'node liri', then '"+cmnd+"' then '"+a.split("+").join(" ")+"'";
        request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey="+OMDb_API_key, function(error, response, bodyd) {
            if (!error && response.statusCode === 200) {
                fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"-----"+a.split("+").join(' ')+" movie found"+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
                console.log("The title is: " + JSON.parse(bodyd).Title);
                console.log("Year of release: " + JSON.parse(bodyd).Year);
                console.log("The movie's IMDb rating is: " + JSON.parse(bodyd).imdbRating);
                console.log("Rotten tomatoes rating is: "+ JSON.parse(bodyd).Ratings[1].Value);
                console.log("Country of production: "+ JSON.parse(bodyd).Country);
                console.log("Movie language: "+ JSON.parse(bodyd).Language);
                console.log("Plot: "+ JSON.parse(bodyd).Plot);
                console.log("Actors include: "+ JSON.parse(bodyd).Actors);
                fs.appendFile("reqlog.txt", JSON.parse(bodyd).Title+','+JSON.parse(bodyd).imdbRating+','+JSON.parse(bodyd).Ratings[1].Value+','+JSON.parse(bodyd).Country+',\r\n'+JSON.parse(bodyd).Language+','+'\r\n'+JSON.parse(bodyd).Plot+','+'\r\n'+JSON.parse(bodyd).Actors+'\r\n', function(err) {if (err) {console.log(err)}});
            }
        });   
    }
}

function twtr(a){
    client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=real_kamran_s&count="+a,function(err,bodyt,resp){
        var temp = "'node liri', then '"+cmnd+"' then '"+a+"'";
        if (!err){bodyt.forEach(twt=>{
            fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"----- "+a+" tweet(s) found"+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
            console.log(twt.text);
            fs.appendFile("reqlog.txt", twt.text+'\r\n', function(err) {if (err) {console.log(err)}});
            })
        }
        else {console.log(resp)}
    })
}

function bandsiT(a){
    if(a){
        //var fartist = a.split(" ").join("+");
        var temp = "'node liri', then '"+cmnd+"' then '"+a.split("+").join(" ")+"'";
        request("https://rest.bandsintown.com/artists/"+a+"/events?app_id="+BIT_key, function(error, response, bodyb) {
            if (!error && !(JSON.parse(bodyb)[0]==undefined)) {
                console.log("-----UPCOMING SHOWS-----");
                console.log("------------------------");
                fs.appendFile("reqlog.txt","-----CONSOLE COMMANDS: "+temp+"-----\r\n"+"-----"+a.split("+").join(' ')+" performances found"+"-----"+"\r\n", function(err){if (err) {console.log(err)}});
                for (i=0;i<JSON.parse(bodyb).length;i++){
                    console.log("The venue: " + JSON.parse(bodyb)[i].venue.name);
                    console.log("Location: " + JSON.parse(bodyb)[i].venue.city);
                    console.log("Date: " + moment(JSON.parse(bodyb)[i].datetime).format("MM/DD/YYYY"));
                    console.log("-------------------------------");
                    fs.appendFile("reqlog.txt", JSON.parse(bodyb)[i].venue.name+','+JSON.parse(bodyb)[i].venue.city+','+moment(JSON.parse(bodyb)[i].datetime).format("MM/DD/YYYY")+'\r\n', function(err) {if (err) {console.log(err)}});
                }
            } else {console.log("I couldn't find an upcoming venue")}
        });      
    }else{console.log("No artist to search for");}   
}
