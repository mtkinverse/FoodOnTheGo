require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const path = require('path')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const riderRoutes = require('./routes/riderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userAuthentication = require('./middlewares/userAuthentication');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials : true// Frontend URL
}));


app.use(express.json());
app.use(cookieParser());
app.use(userAuthentication)

// Use routes
app.use('/', userRoutes);
app.use('/', webRoutes);
app.use('/', ownerRoutes);
app.use('/',riderRoutes);
app.use('/',customerRoutes);
app.use('/',adminRoutes);

const imagesPath = path.join(__dirname, 'images')
app.use('/images', express.static(imagesPath))

// Start server
app.listen(process.env.PORT, () => {
  console.log('Listening on port 8800');
});
