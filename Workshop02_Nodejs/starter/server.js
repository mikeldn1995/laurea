const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const STYLES_DIR = path.join(PUBLIC_DIR, 'styles');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    try {
        // ========================================
        // Task 6 (Bonus) - API Endpoint
        // ========================================
        if (req.url === '/api/time' && req.method === 'GET') {
            const currentDateTime = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                datetime: currentDateTime,
                timestamp: Date.now()
            }));
            return;
        }


        // ========================================
        // Task 2 - Route Mapping
        // ========================================
        // Map URLs to HTML files in the public folder
        let filePath;
        if (req.url === '/') {
            // Home page
            filePath = path.join(PUBLIC_DIR, 'index.html');
        } else if (req.url === '/about') {
            filePath = path.join(PUBLIC_DIR, 'about.html');
        } else if (req.url === '/contact') {
            filePath = path.join(PUBLIC_DIR, 'contact.html');
        }

        // ========================================
        // Task 4 - Serve CSS Files
        // ========================================
        else if (req.url.startsWith('/styles/')) {
            let requestedStyle;

            try {
                requestedStyle = decodeURIComponent(req.url.slice('/styles/'.length));
            } catch (error) {
                handle404(res);
                return;
            }

            filePath = path.resolve(STYLES_DIR, requestedStyle);

            const isInsideStylesDirectory = filePath.startsWith(`${STYLES_DIR}${path.sep}`);
            const isCssFile = path.extname(filePath).toLowerCase() === '.css';

            if (!isInsideStylesDirectory || !isCssFile) {
                handle404(res);
                return;
            }
        }
        else {
            // No route matched -> 404
            handle404(res);
            return;
        }


        // ========================================
        // Task 3 - Serve Files
        // ========================================
        // Read the file and send it to the client
        // Step 1: Get the file extension (e.g., '.html', '.css')
        const extname = path.extname(filePath);

        // Step 2: Get the content type from MIME_TYPES object
        const contentType = MIME_TYPES[extname] || 'text/html';

        // Step 3: Read the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    handle404(res);
                } else {
                    // Server error
                    handleServerError(res, err);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        // Catch any unexpected errors
        handleServerError(res, error);
    }
});


// ========================================
// Task 5 - Error Handling Functions
// ========================================

// Function to handle 404 errors (Page Not Found)
function handle404(res) {
    // Step 1: Create the path to 404.html
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');

    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

// Function to handle 500 errors (Server Error)
function handleServerError(res, error) {
    console.error('Server error:', error);

    // Step 2: Create the path to 500.html
    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');

    fs.readFile(serverErrorPath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}


// ========================================
// Task 1 - Start the Server
// ========================================
// Start listening for requests on PORT 3000
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET /              -> index.html');
    console.log('  GET /about         -> about.html');
    console.log('  GET /contact       -> contact.html');
    console.log('  GET /api/time      -> current date/time');
});
