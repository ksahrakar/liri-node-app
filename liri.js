var env = require("dotenv").config();
var kys = require("./keys");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
