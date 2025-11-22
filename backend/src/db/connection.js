import mysql from 'mysql2/promise';


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'meubanco'
});

export default pool;