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
    try {
        // Fetch the card details by ID
        const card = await fetchCardById();

        // Check if card is an object and has the 'name' property
        if (card && typeof card === 'object' && 'name' in card) {
            const cardName = card.name;
            console.log("Card name:", cardName);

            const imageURL = card.images.large;
            const filename = `images/${cardName}.png`;

            // Determine the card type
            let cardType = '';
            if (card.types && card.types.length > 0) {
                cardType = card.types.join(', ');
            } else {
                // Handle cases where card.types is undefined or empty
                cardType = 'N/A';
            }

            // Download the card image
            download(imageURL, filename, async function () {
                try {
                    // Upload media to Twitter and capture the media ID
                    const mediaId = await twitterClient.v1.uploadMedia(`./${filename}`);

                    // Compile and send the tweet
                    await twitterClient.v2.tweet({
                        text: `Daily #Pokemon Cards\n\n${cardName}\nType: ${cardType}\nSeries: ${card.set.series}\nRarity: ${card.rarity}\nArtist: ${card.artist}\nRelease Date: ${card.set.releaseDate}\nTrend Price: $${card.cardmarket.prices.trendPrice}\nLink to TCG: ${card.tcgplayer.url}`,
                        media: {
                            media_ids: [mediaId]
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        } else {
            throw new Error("Card name not found in the fetched card object");
        }
    } catch (error) {
        console.error("Error fetching card or reading the name property:", error);
    }
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