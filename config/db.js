import mysql from 'mysql2'

export const connection = mysql.createConnection({
    host: 'database-1.cf0ei60qeumd.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'mydb',
    port: 3306 // El puerto por defecto para MySQL
})

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to MySQL`)
})