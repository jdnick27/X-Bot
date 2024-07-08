const { findCardByID, Card } = require('pokemon-tcg-sdk-typescript/dist/sdk');
const axios = require('axios');

// Function to fetch a Pokémon card by its ID
const fetchCardById = async (cardId) => {
  try {
    // Use the SDK to find the card by its ID
    const card = await findCardByID(cardId);
    console.log('Card:', card);
    return card;
  } catch (error) {
    // Log any error encountered during the fetch
    console.error('Error fetching card:', error);
    throw error;
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