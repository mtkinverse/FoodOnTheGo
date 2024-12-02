require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const path = require('path');
const cookieParser = require('cookie-parser');

// Importing routes and middleware
const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const riderRoutes = require('./routes/riderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userAuthentication = require('./middlewares/userAuthentication');

const app = express();

// CORS setup

const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5173' }));

app.use(express.json());
app.use(cookieParser());

// Use the authentication middleware globally if needed
//app.use(userAuthentication);

// Route setup
app.use('/', userRoutes);
app.use('/', webRoutes);
app.use('/', ownerRoutes);
app.use('/', riderRoutes);
app.use('/', customerRoutes);
app.use('/', adminRoutes);

// Serve static images
const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
