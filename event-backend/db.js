const { Pool } = require("pg");

const pool = new Pool({
    host:"localhost",
    port:5432,
    user:"liamsmall",
    password:"",
    database:"eventdb"
});

module.exports = pool;