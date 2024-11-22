const mysql = require('mysql2');

// Create a single connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'edhi',
    database: 'online_food_system'
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
            handleDisconnect(); // Reconnect if the connection is lost
        } else {
            throw err; // Throw other errors to handle them elsewhere
        }
    });
}

// Start the connection
handleDisconnect();

module.exports = db;
