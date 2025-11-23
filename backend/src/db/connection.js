import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',      // deve ser "db" no docker-compose
    user: process.env.DB_USER || 'root',           // aqui será "user" do .env
    password: process.env.DB_PASS || 'rootpassword', // aqui será "password" do .env
    database: process.env.DB_NAME || 'meubanco',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
