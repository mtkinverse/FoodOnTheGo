const mysql = require('mysql2');
require('dotenv').config();

// Extract the DB URL from environment variables
const dbUrl = process.env.dbUrl; // Make sure the .env file contains dbUrl=your-database-url

// Parse the URL using the URL constructor
const parsedUrl = new URL(dbUrl);

// Extract connection details
const db = mysql.createConnection({
    host: parsedUrl.hostname,
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.split('/')[1],  // Extract database name from the pathname
    port: parsedUrl.port
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
