This will be a node.js application that calls three API's and presents information based on user requests

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



Improvements:
* All API keys are private and in .env file
* Input via "inquire" and much more user friendly - arguments are entered intuitively without excessive formatting rules
* A log of all console commands and the responses in reqlog.txt file