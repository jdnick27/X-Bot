require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const { download, readFileToArray, getRandomInt } = require("./utilities");
const { fetchCardById } = require("./fetchPokemonData");

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const tweet = async () => {
    const setsfilePath = './pokemon_card_sets.txt';
    const linesArray = readFileToArray(setsfilePath);
    const cardId = `${linesArray[await getRandomInt(0, 99)]}-${await getRandomInt(1, 5)}`; // Example card ID
    const card = await fetchCardById(cardId);
    const cardName = card.name;
    const imageURL = card.images.large;
    const filename = `images/${cardName}.png`;
    let cardType = '';
    if (card.types.length > 1) {
        cardType = card.types[0];
        for (let i = 1; i < card.types.length; i++) {
            cardType = ', ' + card.types[i];
        }
    } else {
        cardType = card.types[0];
    }

    download(imageURL, filename, async function () {
        try {
            const mediaId = await twitterClient.v1.uploadMedia(`./${filename}`);


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

const cronTweet = new CronJob("0 */6 * * *", async () => {
    tweet();
});

cronTweet.start();