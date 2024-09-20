import jwt from "jsonwebtoken";
const JWT_SECRET = `arqdeapps`;

export function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(401).json({ msg: "Acceso Denegado. No Token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: `Token Invalido` });
    req.userId = decoded.id;
    req.userRole = decoded.rol;
    next();
  });
}

export function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ msg: "No tienes permiso para acceder a esta ubicación" });
    }
    next();
  };
}
