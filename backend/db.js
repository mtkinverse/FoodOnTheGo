const mysql = require('mysql2');
require('dotenv').config();

// Create a single connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:  process.env.DB_NAME
});
// Ensure dbUrl is defined in environment variables
// const dbUrl = process.env.dbUrl;

// if (!dbUrl) {
//     console.error('DATABASE URL is not defined in the environment variables');
//     process.exit(1);
// }

// // Parse the DB URL using the URL constructor
// const parsedUrl = new URL(dbUrl);

// // Extract the connection details
// const db = mysql.createConnection({
//     host: parsedUrl.hostname,
//     user: parsedUrl.username,
//     password: parsedUrl.password,
//     database: parsedUrl.pathname.split('/')[1],  // Extract database name from pathname
//     port: parsedUrl.port || 3306  // Default to 3306 if no port is provided
// });

// Establish the database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
