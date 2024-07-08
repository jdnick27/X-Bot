require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const { download, readFileToArray, getRandomInt } = require("./utilities");
const { fetchCardById } = require("./fetchPokemonData");

// Start the express server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Function to create and send a tweet
const tweet = async () => {
    const setsfilePath = './pokemon_card_sets.txt';
    
    // Read the list of Pokémon card sets from the file
    const linesArray = readFileToArray(setsfilePath);
    
    // Generate a random card ID using the set and a random number
    const cardId = `${linesArray[await getRandomInt(0, 99)]}-${await getRandomInt(1, 5)}`;
    
    // Fetch the card details by ID
    const card = await fetchCardById(cardId);
    const cardName = card.name;
    const imageURL = card.images.large;
    const filename = `images/${cardName}.png`;
    
    // Determine the card type
    let cardType = '';
    if (card.types.length > 1) {
        cardType = card.types[0];
        for (let i = 1; i < card.types.length; i++) {
            cardType += ', ' + card.types[i];
        }
    } else {
        cardType = card.types[0];
    }

    // Download the card image
    download(imageURL, filename, async function () {
        try {
            // Upload media to Twitter and capture the media ID
            const mediaId = await twitterClient.v1.uploadMedia(`./${filename}`);

            // Compile and send the tweet
            await twitterClient.v2.tweet({
                text: `Daily #Pokemon Cards\n\n${card.name}\nType: ${cardType}\nSeries: ${card.set.series}\nRelease Date: ${card.set.releaseDate}\nTrend Price: $${card.cardmarket.prices.trendPrice}`,
                media: {
                    media_ids: [mediaId]
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
};

// Schedule the tweet function to run every 6 hours
const cronTweet = new CronJob("0 */6 * * *", async () => {
    tweet();
});

// Schedule the tweet function to run every 30 seconds, USED FOR TESTING
// const cronTweet = new CronJob("*/30 * * * * *", async () => {
//     tweet();
// });

// Start the cron job
cronTweet.start();