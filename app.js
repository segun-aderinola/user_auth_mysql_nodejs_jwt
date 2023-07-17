const express = require('express');
const conn = require('./middleware/databaseConnector');
const db_table = require('./functions/databaseTables');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use('/user_auth', routes)

app.listen(3000, ()=>{
    console.log(`listening on Port 3000`);
})
// database connection
const dbName = 'user_auth_mysql_nodejs';
conn.connect((err)=>{
    if(err) throw err;
    conn.query('CREATE DATABASE IF NOT EXISTS ' + dbName, (err, data)=>{
        if(err) throw err;
        // console.log('Database Created'+ data);
        // conn.query(db_table, (err, data)=>{
        //     if(err) throw err;
        //     console.log("Database Table Created")
        // });       
    });
    console.log('Database Connected...');
    return;
})