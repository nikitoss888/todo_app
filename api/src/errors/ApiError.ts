class ApiError extends Error {
	status: number;
	errors: unknown[];

	constructor(status: number, message: string, errors: unknown[] = []) {
		super(message);
		Object.setPrototypeOf(this, ApiError.prototype);
		this.status = status;
		this.errors = errors;
	}

	static badRequest(
		message: string = "Error in the Request body",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(400, message, errors);
	}

	static unauthorized(
		message: string = "Unauthorized Request",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(401, message, errors);
	}

	static forbidden(
		message: string = "Access Denied",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(403, message, errors);
	}

	static notFound(
		message: string = "Not Found",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(404, message, errors);
	}

	static internal(
		message: string = "Internal error",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(500, message, errors);
	}

	static serviceUnavailable(
		message: string = "Service Unavailable",
		errors: unknown[] = []
	): ApiError {
		return new ApiError(503, message, errors);
	}
}

export default ApiError;
