import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // This allows all origins for WebSocket connections
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', (message) => {
    console.log(`Message Received: ${message}`);
    io.emit('messageReceived', message); // Broadcasting to all clients
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen({
  port: PORT,
  host: '0.0.0.0'
}, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Get local IP address
const getLocalIpAddress = (): string => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  return '0.0.0.0';
};

const localIpAddress = getLocalIpAddress();


server.listen(PORT, () => {
  console.log(`Server running on:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://${localIpAddress}:${PORT}`);
});