import  config from "../config/mysql"
import mysql2 from "mysql2"

const pool = mysql2.createPool(config)

pool.on('connection', function (connection) {
    console.log('Connection %d id %d in pool', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('error', function (err) {
    console.error('idle client error', err.message, err.stack);
})

export default pool

