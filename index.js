require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const { download } = require("./utilities");
const { fetchCardById } = require("./fetchPokemonData");

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const tweet = async () => {
    const cardId = 'xy10-1'; // Example card ID
    const card = await fetchCardById(cardId);
    const cardName = card.name;
    const imageURL = card.images.large;
    const filename = `images/${cardName}.png`;

    download(imageURL, filename, async function () {
        try {
            const mediaId = await twitterClient.v1.uploadMedia(`./${filename}`);
            

            await twitterClient.v2.tweet({
                text: `Hello world! This is an image ${card.name}`,
                media: {
                    media_ids: [mediaId]
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
};

const cronTweet = new CronJob("*/30 * * * * *", async () => {
    tweet();
});

cronTweet.start();