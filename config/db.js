import mysql from 'mysql2'

export const connection = mysql.createConnection({
    // host: 'database-1.cf0ei60qeumd.us-east-2.rds.amazonaws.com',
    // user: 'admin',
    // password: 'password',
    // database: 'mydb',
    // port: 3306 // El puerto por defecto para MySQL
    host: "galicia-rds.czjxktqmtnno.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "password",
    database: "galicia",
})

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to MySQL`)
})

const selectAllQuery = `

select * from usuarios;

`







connection.query(selectAllQuery, (err, results) => {
    if (err) {
      console.error('Error selecting data:', err);
    } else {
      console.log('Data from usuarios table:', results);
    }
    // Cerrar la conexión después de completar todas las consultas
    
})
  
