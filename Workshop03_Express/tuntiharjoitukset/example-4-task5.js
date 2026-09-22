const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Example route to show normal behavior.
app.get('/', (req, res) => {
  res.send('OK');
});

// 404 handler (after all routes).
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// 500 error handler (must be last).
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Uncomment to run this example.
 app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
 });
