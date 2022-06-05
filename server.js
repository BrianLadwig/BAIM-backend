import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./lib/database.js";
import userRouter from "./routes/userRouter.js"
import beautyRouter from "./routes/beautyRouter.js"
import artsCraftRouter from "./routes/artsCraftRouter.js"
import gardenRouter from "./routes/gardenRouter.js"
import recipeRouter from "./routes/recipeRouter.js"
import eventRouter from "./routes/eventRouter.js"
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import checkLogin from "./middlewares/checkLogin.js";


const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

dotenv.config();
connect();
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter)
app.use('/beauty', checkLogin, beautyRouter)
app.use('/artsCraft', checkLogin, artsCraftRouter)
app.use('/garden', checkLogin, gardenRouter)
app.use('/recipe', checkLogin, recipeRouter)
app.use('/event', checkLogin, eventRouter)
app.use(globalErrorHandler)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listen on ${port}`);
});