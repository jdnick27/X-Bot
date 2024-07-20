const { findCardByID, Card } = require('pokemon-tcg-sdk-typescript/dist/sdk');
const { readFileToArray, getRandomInt } = require("./utilities");
const axios = require('axios');

// Function to fetch a Pokémon card by its ID
const fetchCardById = async (retryCount = 0) => {
  console.log(`Attempt to fetch card, retry count: ${retryCount}`);

  const setsfilePath = './pokemon_card_sets.txt';

  // Read the list of Pokémon card sets from the file
  const linesArray = readFileToArray(setsfilePath);

  // Generate a random card ID using the set and a random number
  const cardId = `${linesArray[await getRandomInt(0, 99)]}-${await getRandomInt(1, 99)}`;
  console.log(`Generated card ID: ${cardId}`);

  try {
    // Use the SDK to find the card by its ID
    const card = await findCardByID(cardId);
    console.log('Fetched card:', card);
    return card;
  } catch (error) {
    // Log any error encountered during the fetch
    console.error('Error fetching card:', error);

    // Retry only once if the retryCount is less than 1
    if (retryCount < 1) {
      console.log('Retrying fetch card...');
      return await fetchCardById(retryCount + 1);
    } else {
      // Handle the error appropriately if retry fails
      throw new Error("Failed to fetch card after retry");
    }
  }
};


// Function to find Pokémon cards by their Pokédex number
const findCardsByPokedexNumber = async (pokedexNumber) => {
  try {
    // Make a GET request to the Pokémon TCG API to search for cards with the given Pokédex number
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      params: {
        q: `nationalPokedexNumbers:${pokedexNumber}`
      }
    });
    // Extract the cards data from the API response
    const cards = response.data.data;
    console.log('Cards:', cards);
    return cards;
  } catch (error) {
    // Log any error encountered during the fetch
    console.error('Error fetching cards:', error);
    throw error;
  }
};

// Export the functions to be used in other modules
module.exports = { fetchCardById, findCardsByPokedexNumber };