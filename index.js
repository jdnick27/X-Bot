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
    // Fetch the card details by ID
    const card = await fetchCardById();
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
                text: `Daily #Pokemon Cards\n\n${card.name}\nType: ${cardType}\nSeries: ${card.set.series}\nRarity: ${card.rarity}\nArtist: ${card.artist}\nRelease Date: ${card.set.releaseDate}\nTrend Price: $${card.cardmarket.prices.trendPrice}\nLink to TCG: ${card.tcgplayer.url}`,
                media: {
                    media_ids: [mediaId]
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
};

// Schedule the tweet function to run at specific times
const cronTimes = ['0 0 * * *', '0 4 * * *', '0 8 * * *', '0 12 * * *', '0 16 * * *', '0 20 * * *'];
const timeZones = 'America/Chicago';

cronTimes.forEach(time => {
    const job = new CronJob(time, tweet, null, true, timeZones);
    job.start();
});

// Schedule the tweet function to run every 30 seconds for testing
const cronTweetTEST = new CronJob("*/30 * * * * *", tweet);

// cronTweetTEST.start();