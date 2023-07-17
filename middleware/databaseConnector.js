const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',    
    user: 'root',
    password: '',
    database: 'user_auth_mysql_nodejs',
})


module.exports = conn;