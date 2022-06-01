import express from "express"
import dotenv from "dotenv";
import connect from "./lib/database.js";
import userRouter from "./routes/userRouter.js"
import beautyRouter from "./routes/beautyRouter.js"
import artsCraftRouter from "./routes/artsCraftRouter.js"
import gardenRouter from "./routes/gardenRouter.js"
import recipeRouter from "./routes/recipeRouter.js"
import eventRouter from "./routes/eventRouter.js"

dotenv.config();
connect();
const app = express();
app.use(express.json());

app.use('/user', userRouter)
app.use('/beauty', beautyRouter)
app.use('/artsCraft', artsCraftRouter)
app.use('/garden', gardenRouter)
app.use('/recipe', recipeRouter)
app.use('/event', eventRouter)


const port = process.env.PORT;

app.listen(port, () => {
  console.log(`listen on ${port}`);
});