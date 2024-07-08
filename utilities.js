const request = require("request");
const fs = require("fs");

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

// Function to read a text file and convert to array
function readFileToArray(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.trim());
    return lines;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);     // Round up to the nearest whole number
  max = Math.floor(max);    // Round down to the nearest whole number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { download, readFileToArray, getRandomInt };