const db_table = () =>{
    `CREATE TABLE user (name VARCHAR(255), address VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255)`;
    `CREATE TABLE another_user (name VARCHAR(255), address VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255)`;
}
module.exports = db_table;