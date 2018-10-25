This will be a node.js application that calls four API's and presents information based on user requests


You will have to ADD YOUR OWN .env file to use this app: use this format and place the file in the root directory
# Spotify API keys
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# OMDb API key
OMDB_KEY=your-OMDb-key

# BandsInTown API key
BIT_Key =your-BiT-key

# Improvements on original assignment:
* All API keys are private and in .env file
* Input via "inquire" and much more user friendly - arguments are entered intuitively without excessive formatting rules
* A log of all console commands and the responses in reqlog.txt file

# Dependencies:
Perform "npm install" to install packages prior to running program
Libraries required:
* request
* inquire
* dotenv
* twitter
* node-spotify-api
* moment
* fs

# Input:
Input is acquired through a recursive inquire call that loads a global "cmnd" variable and a "param" value
- cmnd = function to perform
    * my-tweets = texts my recent tweets
    * concert-this
    * spotify-this
    * movie-this
    * do-it
- param = parameter to pass 
    * number of tweets
    * artist
    * title of song
    * title of movie
    * performs any of the above functions as outlined in an external .txt file

# Walk-through
Link to walk-through
https://drive.google.com/file/d/1tIP86Fs9Tuy5z7IMSB91ThIZzWzmVnNx/view?usp=sharing
