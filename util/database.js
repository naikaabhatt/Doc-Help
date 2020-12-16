const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "internship",
    password: ""
});

module.exports = pool.promise();