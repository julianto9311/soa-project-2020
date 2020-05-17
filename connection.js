const mysql = require('mysql');
const util = require("util");

const conn = mysql.createPool({
    database: 'proyek_soa',
    password: '',
    user: 'root',
    host: 'localhost'
});

conn.query = util.promisify(conn.query);
module.exports = conn;