const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage
const sosData = [
  {
    id: 'SOS-1001',
    latitude: 37.7858,
    longitude: -122.4064,
    message: 'Water level is rising rapidly in our basement. We have two elderly people here who cannot climb stairs easily. We need immediate evacuation assistance.',
    battery: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'SOS-1002',
    latitude: 37.7958,
    longitude: -122.4064,
    message: 'Emergency voice alert activated. Power line down across our driveway, sparking. We are staying inside but smell smoke from the nearby trees. Please send fire department.',
    battery: 42,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'SOS-1003',
    latitude: 37.7650,
    longitude: -122.4200,
    message: 'We are out of drinking water and baby formula. The roads are blocked by debris. We are 3 adults and 1 infant, safe for now but supplies are gone.',
    battery: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];
const rescuers = [
  { id: 'rescuer_1', name: 'Rescuer One', phone: '555-0101' },
  { id: 'rescuer_2', name: 'Rescuer Two', phone: '555-0102' }
];

// In-memory storage for rescuer locations
const rescuerLocations = {};

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

  // Generate an id for the SOS payload if one is not supplied
  const id = req.body.id || `SOS-${Date.now()}`;
  const sosEntry = { id, latitude, longitude, message, battery, timestamp };
  sosData.push(sosEntry);

  // Broadcast the new SOS to all connected clients
  io.emit('newSOS', sosEntry);

  res.json(sosEntry);
});

// ✅ GET /sos endpoint
app.get('/sos', (req, res) => {
  res.json(sosData);
});

// ✅ GET /rescuers endpoint
app.get('/rescuers', (req, res) => {
  res.json(rescuers);
});

// ✅ POST /assign endpoint
app.post('/assign', (req, res) => {
  const { sosId, rescuerId } = req.body;

  if (typeof sosId !== 'string' || typeof rescuerId !== 'string') {
    return res.status(400).json({ error: 'sosId and rescuerId are required' });
  }

  let sosEntry = sosData.find((entry) => entry.id === sosId);

  if (!sosEntry) {
    const parts = sosId.split('-');
    if (parts.length >= 5 && parts[0] === 'SOS') {
      const indexPart = parts[parts.length - 1];
      const lonPart = parts[parts.length - 2];
      const latPart = parts[parts.length - 3];
      const timestampPart = parts.slice(1, parts.length - 3).join('-');

      sosEntry = sosData.find((entry) =>
        entry.latitude.toFixed(4) === latPart &&
        entry.longitude.toFixed(4) === lonPart &&
        entry.timestamp === timestampPart
      );
    }
  }

  if (!sosEntry) {
    return res.status(404).json({
      success: false,
      message: 'SOS alert not found'
    });
  }

  sosEntry.assignedRescuer = rescuerId;

  res.json({
    success: true,
    alert: sosEntry
  });
});

// ✅ POST /resolve endpoint
app.post('/resolve', (req, res) => {
  const { sosId } = req.body;

  if (typeof sosId !== 'string') {
    return res.status(400).json({ error: 'sosId is required' });
  }

  let sosEntry = sosData.find((entry) => entry.id === sosId);

  if (!sosEntry) {
    const parts = sosId.split('-');
    if (parts.length >= 5 && parts[0] === 'SOS') {
      const indexPart = parts[parts.length - 1];
      const lonPart = parts[parts.length - 2];
      const latPart = parts[parts.length - 3];
      const timestampPart = parts.slice(1, parts.length - 3).join('-');

      sosEntry = sosData.find((entry) =>
        entry.latitude.toFixed(4) === latPart &&
        entry.longitude.toFixed(4) === lonPart &&
        entry.timestamp === timestampPart
      );
    }
  }

  if (!sosEntry) {
    return res.status(404).json({
      success: false,
      message: 'SOS alert not found'
    });
  }

  sosEntry.status = 'Resolved';
  sosEntry.resolvedAt = new Date().toISOString();

  res.json({
    success: true,
    alert: sosEntry
  });
});

// ✅ POST /rescuer-location endpoint - Store rescuer's real-time location
app.post('/rescuer-location', (req, res) => {
  const { rescuerId, latitude, longitude, timestamp } = req.body;

  // Validation
  if (!rescuerId || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'rescuerId, latitude, and longitude are required' });
  }

  // Store/update latest location for this rescuer
  rescuerLocations[rescuerId] = {
    rescuerId,
    latitude,
    longitude,
    timestamp: timestamp || new Date().toISOString(),
  };

  console.log(`📍 Updated location for rescuer ${rescuerId}: (${latitude}, ${longitude})`);

  res.json({
    success: true,
    location: rescuerLocations[rescuerId]
  });
});

// ✅ GET /rescuer-locations endpoint - Fetch all active rescuer locations
app.get('/rescuer-locations', (req, res) => {
  const locations = Object.values(rescuerLocations);
  res.json(locations);
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = 5000; // or 3000 if you prefer
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
