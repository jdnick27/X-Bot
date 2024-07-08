const request = require("request");
const fs = require("fs");

// Function to download a file from a given URI and save it to a specified filename
const download = function (uri, filename, callback) {
  // Get the headers of the request to the URI
  request.head(uri, function (err, res, body) {
    // Pipe the response to a writable file stream and execute the callback when done
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

// Function to read a text file and convert its content to an array of lines
function readFileToArray(filePath) {
  try {
    // Read the file content synchronously
    const data = fs.readFileSync(filePath, 'utf8');
    // Split the content by newline and trim each line
    const lines = data.split('\n').map(line => line.trim());
    return lines;
  } catch (err) {
    // Log any error encountered during file read
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

// Function to generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  // Round up the min value and round down the max value
  min = Math.ceil(min);
  max = Math.floor(max);
  // Generate and return the random integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Export the functions to be used in other modules
module.exports = { download, readFileToArray, getRandomInt };