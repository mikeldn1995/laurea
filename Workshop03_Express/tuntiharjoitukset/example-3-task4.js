const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/time', (req, res) => {
  res.json({
    datetime: new Date().toISOString(),
    timestamp: Date.now()
  });
});

// Uncomment to run this example.
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
