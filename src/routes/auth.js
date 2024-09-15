import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "../../config/db.js";

export const authRouter = express.Router();

const JWT_SECRET = `inchaustikpo`

authRouter.post("/register", (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ msg: "Por favor completa todos los campos" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO test_user (nombre, email, password, rol) VALUES (?, ?, ?, ?)`;
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

  const query = `SELECT * FROM test_user WHERE email = ?`;
  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ msg: `Usuario no encontrado` });

    const user = results[0];

    //verificar password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: `Contraseña incorrecta` });

    // generar el token
    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, {
      expiresIn: `1h`,
    });

    res.json({ token, rol: user.rol });
  });
});
