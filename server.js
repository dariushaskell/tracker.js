const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pako = require('pako');
const app = express();
const port = 3000;

// Configure dynamic CORS options
const allowedOrigins = ['http://127.0.0.1:8081', 'http://localhost:8080', 'http://localhost:3000'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware to parse JSON body
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '1mb' }));

// Route to handle data saving
app.post('/save-tracking-data', (req, res) => {
  const compressedData = req.body;
  const decompressedData = pako.inflate(compressedData, { to: 'string' });
  const data = JSON.parse(decompressedData);
  const logEntry = `${new Date().toISOString()} - ${JSON.stringify(data)}\n`;

  // Append the data to a text file
  fs.appendFile(path.join(__dirname, 'tracking_data.txt'), logEntry, (err) => {
    if (err) {
      console.error('Error saving tracking data:', err);
      res.status(500).send('Error saving data');
    } else {
      res.status(200).send('Data saved');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
