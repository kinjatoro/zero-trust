import express from "express";
import { router } from "./src/routes/hello.js";
import {authRouter} from "./src/routes/auth.js"
import cors from 'cors'
import mysql from "mysql2";

const app = express();
app.use(express.json());


//test
app.use(cors())


app.use("/api", router);
app.use("/api", authRouter);


// app.use("/test")

app.listen(4000, () => {
  console.log("Server on port 4000");
});
