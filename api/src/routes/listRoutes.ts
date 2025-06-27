import express from "express";
import {
	create,
	update,
	readOne,
	deleteList,
	addViewer,
	removeViewer,
} from "../controllers/listController";
import taskRouter from "./taskRoutes";
import canAccess from "../middleware/CanAccessMiddleware";

const listRouter = express.Router();

listRouter.post("/", create);
listRouter.get("/:listId", canAccess("read"), readOne);
listRouter.patch("/:listId", canAccess("edit"), update);
listRouter.delete("/:listId", canAccess("edit"), deleteList);

listRouter.post("/:listId/viewers", canAccess("edit"), addViewer);
listRouter.delete("/:listId/viewers", canAccess("edit"), removeViewer);

listRouter.use("/:listId/tasks", taskRouter);

export default listRouter;
