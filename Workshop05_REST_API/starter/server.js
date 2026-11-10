const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const pagesRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');
const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Create starter/.env using .env.example.');
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog', serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB: blog');
  } catch (error) {
    // Do not print connection strings, which may contain credentials.
    throw new Error(`MongoDB connection failed (${error.name}). Check MONGODB_URI and database access.`);
  }
}

app.locals.publicDir = publicDir;
app.use(express.json());
app.use(express.static(publicDir, { index: false }));
app.use('/', pagesRouter);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.name === 'ValidationError' || error.name === 'CastError' || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid request data' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }
  console.error('Request failed:', error.name);
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(500).sendFile(path.join(publicDir, '500.html'));
});

connectToDatabase().then(() => {
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Pages: /, /about, /contact, /blog');
    console.log('API: GET/POST /api/posts; GET/PUT/DELETE /api/posts/:id');
  });
  server.on('error', async error => {
    console.error('Server failed to start:', error.code);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
