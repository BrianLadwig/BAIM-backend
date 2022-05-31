import express from "express"
import dotenv from "dotenv";
import connect from "./lib/database.js";



dotenv.config();
connect();
const app = express();
app.use(express.json());









const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listen on ${port}`);
});