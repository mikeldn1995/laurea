const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Log every request before another middleware sends a response.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve stylesheets, images, and other assets from the public directory.
app.use(express.static(PUBLIC_DIR, { index: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'contact.html'));
});

// Keep API routes together under the /api path.
const apiRouter = express.Router();

apiRouter.get('/time', (req, res) => {
    res.json({
        datetime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

apiRouter.get('/info', (req, res) => {
    res.json({
        name: 'Workshop03 Express Server',
        version: '1.0.0',
        nodeVersion: process.version,
        expressVersion: require('express/package.json').version
    });
});

apiRouter.get('/status', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});

app.use('/api', apiRouter);

// Return the custom 404 page for every unmatched request.
app.use((req, res) => {
    const notFoundPage = path.join(PUBLIC_DIR, '404.html');

    res.status(404).sendFile(notFoundPage, (error) => {
        if (!error) {
            return;
        }

        if (!res.headersSent) {
            res.status(404).type('text/plain').send('404 - Page Not Found');
        } else {
            res.end();
        }
    });
});

// Handle errors passed by routes and middleware.
app.use((error, req, res, next) => {
    console.error('Server Error:', error.stack || error);

    if (res.headersSent) {
        next(error);
        return;
    }

    const serverErrorPage = path.join(PUBLIC_DIR, '500.html');

    res.status(500).sendFile(serverErrorPage, (sendFileError) => {
        if (!sendFileError) {
            return;
        }

        if (!res.headersSent) {
            res.status(500).type('text/plain').send('500 - Internal Server Error');
        } else {
            res.end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET /              -> Home page');
    console.log('  GET /about         -> About page');
    console.log('  GET /contact       -> Contact page');
    console.log('  GET /api/time      -> Current date/time API');
    console.log('  GET /api/info      -> Server information API');
    console.log('  GET /api/status    -> Server status API');
});
