import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TradesListPage from "./TradesListPage";

vi.mock("../api/trades", () => ({
	fetchTrades: vi.fn(),
}));

const fetchTrades = (await import("../api/trades")).fetchTrades as unknown as vi.MockedFunction<
	typeof import("../api/trades").fetchTrades
>;

describe("TradesListPage", () => {
	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		fetchTrades.mockReset();
	});

	it("loads and displays trades on success", async () => {
		fetchTrades.mockResolvedValue([
			{
				id: 1,
				exchangeAccountId: 1,
				symbol: "BTCUSDT",
				side: "BUY",
				quantity: "0.01",
				price: "50000",
				fee: "1",
				realizedPnl: "10",
				openedAt: "2024-01-01T00:00:00Z",
				closedAt: null,
			},
		]);

		render(<TradesListPage />);

		fireEvent.change(screen.getAllByLabelText(/account id/i)[0], { target: { value: "1" } });
		fireEvent.change(screen.getByLabelText(/from/i), { target: { value: "2024-01-01T00:00:00Z" } });
		fireEvent.change(screen.getByLabelText(/to/i), { target: { value: "2024-01-02T00:00:00Z" } });

		fireEvent.click(screen.getByRole("button", { name: /load trades/i }));

		expect(await screen.findByText("BTCUSDT")).toBeInTheDocument();
		expect(screen.getByText("BUY")).toBeInTheDocument();
	});

	it("shows an error message when load fails", async () => {
		fetchTrades.mockRejectedValue(new Error("boom"));

		render(<TradesListPage />);

		fireEvent.change(screen.getAllByLabelText(/account id/i)[0], { target: { value: "1" } });
		fireEvent.change(screen.getByLabelText(/from/i), { target: { value: "2024-01-01T00:00:00Z" } });
		fireEvent.change(screen.getByLabelText(/to/i), { target: { value: "2024-01-02T00:00:00Z" } });

		fireEvent.click(screen.getByRole("button", { name: /load trades/i }));

		expect(await screen.findByText(/boom/i)).toBeInTheDocument();
	});
});
