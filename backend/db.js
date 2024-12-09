const mysql = require('mysql2');
require('dotenv').config(); 
// Create a single connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:  process.env.DB_NAME
});

// Function to initialize connection and handle disconnects
function handleDisconnect() {
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            console.log('Connected to the database');
        }
    });

    db.on('error', (err) => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to the database...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

// Start the connection
handleDisconnect();

module.exports = db;
