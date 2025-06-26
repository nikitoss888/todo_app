import { PartialUser } from "../types";

declare global {
	namespace Express {
		interface Request {
			user?: PartialUser;
		}
	}
}
