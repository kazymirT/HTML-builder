const path = require('path');
const fs = require('fs');
const readableStream = fs.createReadStream(path.join(__dirname, 'notes.txt'), 'utf-8');
readableStream.on('data', chunk => console.log(chunk));
