import express from "express";
import { router } from "./src/routes/hello.js";
import {authRouter} from "./src/routes/auth.js"
import mysql from "mysql2";

const app = express();
app.use(express.json());

app.use("/api", router);
app.use("/api", authRouter);


// app.use("/test")

app.listen(3000, () => {
  console.log("Server on port 3000");
});
