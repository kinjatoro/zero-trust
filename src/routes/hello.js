import express from "express";
import { verifyToken, authorizeRole } from "../middleware/verify.js";

export const router = express.Router();
router.get("/hello", verifyToken, authorizeRole(["admin"]), (req, res) => {
  res.json({ msg: "Bienvenido, administrador" });
});
