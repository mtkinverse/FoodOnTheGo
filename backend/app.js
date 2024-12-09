require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require('./socket'); // Import the socket file

const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const riderRoutes = require('./routes/riderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userAuthentication = require('./middlewares/userAuthentication');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socket.init(server);

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(userAuthentication);

// Use routes
app.use('/', userRoutes);
app.use('/', webRoutes);
app.use('/', ownerRoutes);
app.use('/', riderRoutes);
app.use('/', customerRoutes);
app.use('/', adminRoutes);

const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Example of listening for messages from the client
  socket.on('updateStatus', (orderId, newStatus) => {
    console.log(`Order ID: ${orderId}, New Status: ${newStatus}`);
    // You can now emit this updated status to other clients
    io.emit('statusUpdated', { orderId, newStatus });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
