import mysql from 'mysql2'

export const connection = mysql.createConnection({
    /* dejamos las credenciales de una rds que creamos para entornos de prueba
      (porque al rds que está adentro de las VPC directamente no te podés
      conectar si no estás corriendo el back desde el EC2.)
      Lo mismo con el front, por eso los endpoints apuntan al localhost:4000, que sería este back.
       */
    host: "database-1.cswhig3bmwzx.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "kinjatoro60",
    database: "my_db",
})

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to MySQL`)
})

const selectAllQuery = `
select * from usuarios
`

connection.query(selectAllQuery, (err, results) => {
    if (err) {
      console.error('Error selecting data:', err);
    } else {
      console.log('Data from usuarios table:', results);
    }
    // Cerrar la conexión después de completar todas las consultas
    
})
  
