import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/ErrorHandlingMiddleware";
import userRouter from "./routes/userRoutes";
import listRouter from "./routes/listRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Hello World!" });
});

app.use("/users", userRouter);
app.use("/lists", listRouter);

app.use(errorHandler);

export default app;
