import express from "express";
import {
	create,
	deleteTask,
	getAll,
	getOne,
	setDone,
	update,
} from "../controllers/taskController";
import canAccess from "../middleware/CanAccessMiddleware";

const taskRouter = express.Router({ mergeParams: true });

taskRouter.post("/", canAccess("edit"), create);
taskRouter.get("/:taskId", canAccess("read"), getOne);
taskRouter.get("/", canAccess("read"), getAll);
taskRouter.patch("/:taskId", canAccess("edit"), update);
taskRouter.patch("/:taskId/setDone", canAccess("read"), setDone);
taskRouter.delete("/:taskId", canAccess("edit"), deleteTask);

export default taskRouter;
