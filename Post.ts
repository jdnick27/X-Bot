// tweet.ts
import { TwitterApi } from 'twitter-api-v2';

// Define a custom type to represent a tweet
interface TweetV2 {
    id: string;
    text: string;
    // Add other properties as needed
}

// Replace the following with your actual keys and tokens
const client = new TwitterApi({
    appKey: 'P9QXOfKWdemeRaLJgUr51RMu9',
    appSecret: 'dMH37mHU2xi5JYPnuGd5YUmD9PGS26x6WPsz3BkFdMr7xdvx0j',
    accessToken: '598119051-1J1hJXUlR076ToEgRK8cmBaejdqO2XITOCkAJP0X',
    accessSecret: 'zmCu38NpTIOHLj7geLHj1dqZ66SHN4QZpjcqRHruhfDGI',
});

async function postTweet(message: string) {
    try {
        const twitterClient = client.readWrite;
        const response = await twitterClient.v2.tweet(message);
        console.log('Tweet posted successfully:', response.data);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

// async function readTweet() {
//     try {
//         const twitterClient = client.readOnly;
//         const response = await twitterClient.v2.userByUsername('jdnick27');
//         const userId = response.data.id;
//         const tweetResponse = await twitterClient.v2.userTimeline(userId, { max_results: 1 });

//         // Check if tweetResponse.data is an array
//         if (Array.isArray(tweetResponse.data) && tweetResponse.data.length > 0) {
//             const tweet = tweetResponse.data[0] as TweetV2;
//             console.log('Latest tweet:', tweet);
//         } else {
//             console.log('No tweets found.');
//         }
//     } catch (error) {
//         console.error('Error reading tweet:', error);
//     }
// }

let counter = 0; // Initialize a counter variable

// Function to be called on the specified time interval
function myMethod() {
    // Call the function with the tweet message
    postTweet(`testing timer, post#: ${counter}`);
    // readTweet(); // Call the function to read the tweet
    counter++; // Increment the counter

    // Check if counter reaches 3 (for example)
    if (counter === 3) {
        clearInterval(intervalId); // Stop the interval
        console.log("Interval stopped after 3 iterations.");
    }
}

// Call the function every minute
const intervalId = setInterval(myMethod, 60000); // 60000 milliseconds = 1 minute

// myMethod();

//client ID: aEhxcURCZnFDWjIxRkN6QjhyVnU6MTpjaQ
//client secret: FlqquqU7a4nxPmT7vFDuqNRAN43FbG9bEdWiKAA17Okpgjx4FA


//to run the project use this command ts-node Post.ts