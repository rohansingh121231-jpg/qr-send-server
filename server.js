// --- Node.js Server for QR Send Pro (Render.com) ---
// Is server ka *sirf ek kaam* hai: PeerJS server chalana.
// Yeh HTML file serve nahi karega (woh kaam Netlify kar raha hai).

const express = require('express');
const { PeerServer } = require('peer');
const http = require('http');

// --- 1. Basic App Setup ---
const app = express();
// Render.com hamein batayega ki kaun sa port istemal karna hai
const PORT = process.env.PORT || 9000; 

// --- 2. Uptime Robot ke liye "Ping" Route ---
// Yeh Uptime Robot ko "Main zinda hoon" ka signal dega.
// Yeh aapke 100GB data mein se *kuch bhi* kharch nahi karega.
app.get('/', (req, res) => {
  res.send('PeerJS Server is running. Ready for pings.');
});

// --- 3. Create HTTP Server ---
const server = http.createServer(app);

// --- 4. Setup Private PeerServer ---
const peerServer = PeerServer({
  path: '/peerjs', // Clients is path par connect honge
  proxied: true,   // Deployment ke liye zaroori
  allow_discovery: true,
});

// PeerServer ko mukhya server ke 'upgrade' (WebSocket) event se jod dein
server.on('upgrade', (request, socket, head) => {
  peerServer.handleUpgrade(request, socket, head);
});

// Server connections ko log karein (optional)
peerServer.on('connection', (client) => {
  console.log(`[PeerServer] Client connected: ${client.getId()}`);
});

// Server disconnections ko log karein (optional)
peerServer.on('disconnect', (client) => {
  console.log(`[PeerServer] Client disconnected: ${client.getId()}`);
});

// --- 5. Start the Server ---
server.listen(PORT, () => {
  console.log(`[Server] Online aur http://localhost:${PORT} par chal raha hai`);
  console.log(`[PeerServer] Mukhya server se jud gaya, path: /peerjs`);
});
