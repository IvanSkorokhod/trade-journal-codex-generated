const API_BASE_URL = "http://localhost:8080";

async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
	const url = new URL(`${API_BASE_URL}${path}`);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, String(value));
			}
		});
	}

	const response = await fetch(url.toString(), { method: "GET" });

	if (!response.ok) {
		const message = await response.text().catch(() => "");
		throw new Error(`GET ${url.toString()} failed: ${response.status} ${response.statusText} ${message}`.trim());
	}

	return response.json() as Promise<T>;
}

export { API_BASE_URL, apiGet };
