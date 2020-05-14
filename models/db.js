const mysql = require("mysql");

const pool = mysql.createPool({
    host: "localhost",
    database: "proyek_soa",
    user: "root",
    password: ""
});

function executeQuery(conn, query) {
    return new Promise(function (resolve, reject) {
        conn.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        })
    });
}

module.exports = {
    "executeQuery": executeQuery,
    "getConnection": getConnection
}