const express = require('express');
const cors = require('cors'); // Add this line
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://127.0.0.1:5173', // Ensure no trailing slash here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Use routes
app.use('/', userRoutes);
app.use('/', webRoutes);

// Start server
app.listen(8800, () => {
  console.log('Listening on port 8800');
});
