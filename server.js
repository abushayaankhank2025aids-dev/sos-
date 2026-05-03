const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage
const sosData = [];

// ✅ POST /sos endpoint
app.post('/sos', (req, res) => {
  const { latitude, longitude, message, battery, timestamp } = req.body;

  // Validation
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof message !== 'string' ||
    typeof battery !== 'number' ||
    typeof timestamp !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid payload format' });
  }

  // Store raw payload exactly as received
  const sosEntry = { latitude, longitude, message, battery, timestamp };
  sosData.push(sosEntry);

  // Return the same object (no extra fields)
  res.json(sosEntry);
});

// ✅ GET /sos endpoint
app.get('/sos', (req, res) => {
  res.json(sosData);
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = 5000; // or 3000 if you prefer
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
