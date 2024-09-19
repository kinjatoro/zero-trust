import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "../../config/db.js";
import  {sendMail}  from "../middleware/nodemailer.js"; // Importa el servicio de correo

export const authRouter = express.Router();

const JWT_SECRET = `inchaustikpo`

authRouter.post("/register", (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ msg: "Por favor completa todos los campos" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)`;
  connection.query(
    query,
    [nombre, email, hashedPassword, rol],
    (err, result) => {
      if (err)
        return res.status(500).json({ msg: "Error al registrar usuario" });
      res.status(201).json({ msg: `Usuario registrado exitosamente` });
    }
  );
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email)

  if (!email || !password) {
    return res.status(400).json({ msg: `Por favor complete todos los campos` });
  }

  const query = `SELECT * FROM usuarios WHERE email = ?`;
  connection.query(query, [email], async (err, results) => {
    if (err || results.length === 0){
      console.log(err);
      return res.status(400).json({ msg: `Usuario no encontrado` });}

    const user = results[0];
    if (password != user.password) return res.status(400).json({ msg: `Contraseña incorrecta` });




   // Generar y enviar el código de verificación
   const code = generateCode();
   await sendMail(email, code);

   // Guardar el código en la base de datos con una fecha de expiración
   const expirationDate = new Date(Date.now() + (15 * 60 * 1000) + (3 * 60 * 60 * 1000));
   const codeQuery = `INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)`;
   connection.query(
       codeQuery,
       [user.id, code, expirationDate],
       (err) => {
           if (err) return res.status(500).json({ msg: "Error al guardar el código de verificación" });

           res.status(200).json({ msg: "Se ha enviado un código de verificación al correo electrónico. Por favor, ingréselo para completar el inicio de sesión." });
       }
   );
  });
});


authRouter.post("/verify-code", (req, res) => {
    const { email, code, ip } = req.body;

    if (!email || !code) {
        return res.status(400).json({ msg: "Por favor complete todos los campos" });
    }

    console.log('Email:', email);
    console.log('Code:', code);
    console.log('IP del usuario:', ip);

    // Verificar el código en la base de datos
    const query = `
        SELECT * FROM verification_codes 
        WHERE user_id = (SELECT id FROM usuarios WHERE email = ?) 
        AND code = ? 
        AND expires_at > NOW()
    `;

    connection.query(query, [email, code], (err, results) => {
        if (err) {
            console.error('Error en la consulta de verificación de código:', err);
            return res.status(500).json({ msg: "Error al verificar el código" });
        }

        console.log('Resultados de verificación de código:', results);

        if (results.length > 0) {
            // Código válido, obtener el usuario
            const userId = results[0].user_id;
            const tokenQuery = `SELECT * FROM usuarios WHERE id = ?`;
            connection.query(tokenQuery, [userId], (err, userResults) => {
                if (err || userResults.length === 0) {
                    console.error('Error en la consulta de usuario o usuario no encontrado:', err);
                    return res.status(500).json({ msg: "Error al obtener el usuario" });
                }

                const user = userResults[0];

                // Si el usuario es admin o master, validar la IP
                if (user.rol === 'admin' || user.rol === 'master') {
                    const ipQuery = `SELECT * FROM ips_registradas WHERE user_id = ? AND ip_address = ?`;
                    connection.query(ipQuery, [user.id, ip], (err, ipResults) => {
                        if (err) {
                            console.error('Error al consultar las IPs registradas:', err);
                            return res.status(500).json({ msg: "Error al validar la IP" });
                        }

                        if (ipResults.length === 0) {
                            // Si no se encuentra la IP registrada, rechazar la solicitud
                            return res.status(403).json({ msg: "IP no autorizada" });
                        }

                        // IP válida, generar el token
                        const token = jwt.sign(
                            { id: user.id, rol: user.rol, username: user.nombre },
                            JWT_SECRET,
                            { expiresIn: '1h' }
                        );
                        res.status(200).json({ token, rol: user.rol, username: user.nombre });
                    });
                } else {
                    // Si el usuario no es admin o master, solo generar el token
                    const token = jwt.sign(
                        { id: user.id, rol: user.rol, username: user.nombre },
                        JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.status(200).json({ token, rol: user.rol, username: user.nombre });
                }
            });
        } else {
            console.log('Código inválido o expirado');
            res.status(400).json({ msg: "Código inválido o expirado" });
        }
    });
});

authRouter.get('/users', (req, res) => {
  const query = 'SELECT id, nombre, email, rol FROM usuarios';
  connection.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ msg: "Error al obtener los usuarios" });
      }

      // Enviar la lista de usuarios en formato JSON
      res.status(200).json(results);
  });
});


const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

