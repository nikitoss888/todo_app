const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const getHeaders = (token?: string): HeadersInit => ({
	"Content-Type": "application/json",
	...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const apiClient = {
	async post<T>(url: string, data: unknown, token?: string): Promise<T> {
		const res = await fetch(`${API_URL}${url}`, {
			method: "POST",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		});
		const contentType = res.headers.get("content-type");
		if (!res.ok) {
			if (contentType?.includes("application/json")) {
				throw await res.json();
			} else {
				const text = await res.text();
				throw new Error(text);
			}
		}
		if (contentType?.includes("application/json")) {
			return res.json();
		} else {
			const text = await res.text();
			throw new Error(text);
		}
	},

	async get<T>(url: string, token?: string): Promise<T> {
		const res = await fetch(`${API_URL}${url}`, {
			headers: getHeaders(token),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	async patch<T>(url: string, data: unknown, token?: string): Promise<T> {
		const res = await fetch(`${API_URL}${url}`, {
			method: "PATCH",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	async delete<T>(url: string, data: unknown, token?: string): Promise<T> {
		const res = await fetch(`${API_URL}${url}`, {
			method: "DELETE",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},
};
