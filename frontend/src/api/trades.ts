import { apiGet } from "./client";

// Note: numeric fields come back as strings from the backend (BigDecimal); keep as strings to avoid precision issues.
export type Trade = {
	id: number;
	exchangeAccountId: number;
	symbol: string;
	side: string;
	quantity: string;
	price: string;
	fee: string;
	realizedPnl: string;
	openedAt: string;
	closedAt: string | null;
};

export async function fetchTrades(params: {
	accountId: number;
	from: string;
	to: string;
	symbol?: string;
}): Promise<Trade[]> {
	return apiGet<Trade[]>("/api/trades", params);
}
