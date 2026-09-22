const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Task 2: Serve static files from public/.
//app.use(express.static("public"));

// Optional: basic root response to verify the server is up.
app.get("/", (req, res) => {
  res.send("FullStack on kivaa!.");
});

app.get("/about", (req, res) => {
  res.send("FullStack on about!.");
});

app.get("/contact", (req, res) => {
  res.send("FullStack contact!.");
});
// Uncomment to run this example.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
