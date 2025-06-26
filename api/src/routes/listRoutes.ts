import express from "express";
import {
	create,
	edit,
	readOne,
	deleteList,
} from "../controllers/listController";
import auth from "../middleware/AuthMiddleware";

const listRouter = express.Router();

listRouter.post("/", auth, create);
listRouter.get("/:id", auth, readOne);
listRouter.patch("/:id", auth, edit);
listRouter.delete("/:id", auth, deleteList);

export default listRouter;
