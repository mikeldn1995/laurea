// Import Node.js built-in HTTP module

const http = require('http');

// create the web server

const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content typ
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    console.log('Request received:', req.url);

    // Send the response body "Hello World"
    res.end('Hello World\n');
});

// Prints a log once the server starts listening
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});