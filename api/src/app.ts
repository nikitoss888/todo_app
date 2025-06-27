import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/ErrorHandlingMiddleware";
import userRouter from "./routes/userRoutes";
import listRouter from "./routes/listRoutes";
import auth from "./middleware/AuthMiddleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

app.use("/users", userRouter);
app.use("/lists", auth, listRouter);

app.use(errorHandler);

export default app;
