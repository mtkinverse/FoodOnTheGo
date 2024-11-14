const express = require('express');
const cors = require('cors'); // Add this line
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
}));


app.use(express.json());
app.use(cookieParser());

// Use routes
app.use('/', userRoutes);
app.use('/', webRoutes);
app.use('/', ownerRoutes);

// Start server
app.listen(8800, () => {
  console.log('Listening on port 8800');
});
