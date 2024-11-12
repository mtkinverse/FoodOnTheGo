const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const webRoutes = require('./routes/webRoutes');

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/',userRoutes);
app.use('/',webRoutes);

app.listen(8800, () => {
    console.log('Listening on port 8800');
});
