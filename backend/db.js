const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'edhi',
    database:'db_project'
});

db.connect((err) => {
    if(err)
    {
        console.log("Error connecting" + err.stack);
        return;
    }
    console.log('connected to database');
})

module.exports = db;