import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, apiGet } from "./client";

describe("apiGet", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("builds URL with query params and calls fetch once", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
			ok: true,
			json: async () => ({}),
		} as Response);

		await apiGet("/api/test", { a: "1", b: 2 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const calledUrl = (fetchMock.mock.calls[0]?.[0] as string) || "";
		expect(calledUrl.startsWith(`${API_BASE_URL}/api/test`)).toBe(true);
		const url = new URL(calledUrl);
		expect(url.searchParams.get("a")).toBe("1");
		expect(url.searchParams.get("b")).toBe("2");
	});

	it("resolves with JSON body when response is ok", async () => {
		const body = { foo: "bar" };
		vi.spyOn(globalThis, "fetch").mockResolvedValue({
			ok: true,
			json: async () => body,
		} as Response);

		const result = await apiGet<typeof body>("/api/foo");

		expect(result).toEqual(body);
	});

	it("throws an error when response is not ok", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue({
			ok: false,
			status: 500,
			statusText: "Server Error",
			text: async () => "boom",
		} as Response);

		await expect(apiGet("/api/error")).rejects.toThrow();
	});
});
