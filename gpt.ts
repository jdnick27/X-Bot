import axios, { AxiosError } from 'axios';

// Define your OpenAI API key
const apiKey = 'sk-proj-zeZEK8J5wQ90AejdvT1sT3BlbkFJzZi8nA3fZkuLQggGd7Ky';

// Define the question you want to ask
const question: string = "What is the capital of France?";

// Define the parameters for the API request, including the "model" parameter
const params = {
    prompt: question,
    model: "gpt-4o", // Specify the model you want to use
    max_tokens: 50, // Adjust max_tokens as needed for the length of the response
    temperature: 0.7, // Adjust temperature for creativity vs. coherence
    stop: "\n", // Stop generation at the end of the first response
  };


// Define the headers for the API request
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
};


// Make the API request to OpenAI
axios.post('https://api.openai.com/v1/completions', params, { headers })
  .then(response => {
    // Handle the response from the API
    const answer: string = response.data.choices[0].text.trim();
    console.log('Question:', question);
    console.log('Answer:', answer);
  })
  .catch((error: AxiosError) => {
    // Handle any errors that occur during the request
    if (error.response) {
      const responseData: any = error.response.data;
      console.error('Error:', responseData.error);
    } else {
      console.error('Error:', error.message);
    }
  });