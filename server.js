 // --- Naya, Behtar server.js code (CORS Fix ke saath) ---
const express = require('express');
const { ExpressPeerServer } = require('express-peer-server');
const http = require('http');
const cors = require('cors'); // <-- NAYI LINE (CORS ko import karein)

const app = express();
const PORT = process.env.PORT || 9000;

// --- NAYI LINE (CORS ko permission dene ke liye) ---
// Yeh line Netlify (ya kisi bhi domain) se request ko allow karegi
app.use(cors());

// 1. Uptime Robot ke liye "Ping" Route
// Yeh check karega ki server zinda hai.
app.get('/', (req, res) => {
  res.status(200).send('PeerJS Server is running. Ready for pings.');
});

// 2. HTTP server banayein
const server = http.createServer(app);

// 3. PeerServer ke options
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs', // Client is path par connect hoga
  allow_discovery: true,
  debug: true
});

// 4. PeerServer ko Express app ke saath jodein
app.use(peerServer);

// 5. Server ko start karein
server.listen(PORT, () => {
  console.log(`[Server] Online aur http://localhost:${PORT} par chal raha hai`);
  console.log(`[PeerServer] Path: /peerjs`);
});
