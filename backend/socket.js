const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  if (io) return io;
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {

    socket.on('join', async (data) => {
        const { userId, role } = data;

        if (role === 'user') {
            await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (role === 'captain') {
            await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
    });

    socket.on('update-location-captain', async (data) => {
        const { userId, location } = data;

        if(!location || !location.lat || !location.lon){
          return socket.emit('error', { message: 'Invalid location data' });
        }

        await captainModel.findByIdAndUpdate(userId, { 
          location: {
            lat: location.lat,
            lon: location.lon
          }  
        });
    });

    // handle user location updates
    socket.on('update-location-user', async (data) => {
        const { userId, location } = data;

        if(!location || !location.lat || !location.lon){
          return socket.emit('error', { message: 'Invalid location data' });
        }

        await userModel.findByIdAndUpdate(userId, {
            location: {
                lat: location.lat,
                lon: location.lon
            }
        });
    });
  });

  return io;
}

function sendMessageToSocketId(socketId, message) {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket(server) first.');
  }
  io.to(socketId).emit(message.event, message.data);
}

module.exports = { initializeSocket, sendMessageToSocketId };
