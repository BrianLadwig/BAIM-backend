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
import commentsRouter from "./routes/commentsRouter.js"
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import requestLogger from "./middlewares/requestLogger.js";


const corsOptions = {
  origin: 'https://loka.vercel.app', //included origin as true
  credentials: true, //included credentials as true
};

dotenv.config();
connect();
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    }
  })
);

app.use(requestLogger)
app.use('/user', userRouter)
app.use('/beauty', beautyRouter)
app.use('/artsCraft', artsCraftRouter)
app.use('/garden', gardenRouter)
app.use('/recipe', recipeRouter)
app.use('/event', eventRouter)
app.use('/comments', commentsRouter)
app.use(globalErrorHandler)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listen on ${port}`);
});