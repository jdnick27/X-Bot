this is a bot that will post to a twitter account. 

## TO Run
use the command node index.js

## Description
this interacts witht he tcg player API to get pokemon data. It parses the data to get the cards image URL and downloads it to the project. It also then takes that information and posts it to X using the X api. 

## Card API
https://docs.pokemontcg.io/

## pokemon_card_sets.txt
used to get a list of all the current sets ID's. To add a new set, get the ID and add to the end of the list on a new line

## .env file setup
Find these in the x developer page.

NODE_ENV="development"
API_KEY=""
API_SECRET=""
ACCESS_TOKEN=""
ACCESS_SECRET=""
BEARER_TOKEN=""

APP_ID=""

CLIENT_ID=""
CLIENT_SECRET=""

## images folder
stores the images of the files that are downloaded from the API

## OTHER INFO
the banner.png and profilepic.jpg is the images used on the Pokemon Daily X account