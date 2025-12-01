import React, { useMemo, useState } from "react";
import { fetchTrades } from "../api/trades";
import type { Trade } from "../api/trades";

type TradesListPageProps = Record<string, never>;

const TradesListPage: React.FC<TradesListPageProps> = () => {
	const nowIso = useMemo(() => new Date().toISOString(), []);

	const [accountId, setAccountId] = useState<string>("");
	const [from, setFrom] = useState<string>("2024-01-01T00:00:00Z");
	const [to, setTo] = useState<string>(nowIso);
	const [symbol, setSymbol] = useState<string>("");
	const [trades, setTrades] = useState<Trade[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const canLoad = accountId.trim() !== "" && from.trim() !== "" && to.trim() !== "";

	const handleLoad = async () => {
		if (!canLoad) {
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const payload = {
				accountId: Number(accountId),
				from: from.trim(),
				to: to.trim(),
				symbol: symbol.trim() || undefined,
			};
			const data = await fetchTrades(payload);
			setTrades(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to load trades";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "1rem", maxWidth: 900, margin: "0 auto" }}>
			<h1>Trades</h1>
			<div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
				<label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					Account ID:
					<input
						type="number"
						value={accountId}
						onChange={(e) => setAccountId(e.target.value)}
						placeholder="e.g. 1"
					/>
				</label>
				<label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					From:
					<input
						type="text"
						value={from}
						onChange={(e) => setFrom(e.target.value)}
						placeholder="2024-01-01T00:00:00Z"
					/>
				</label>
				<label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					To:
					<input
						type="text"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						placeholder={nowIso}
					/>
				</label>
				<label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					Symbol (optional):
					<input
						type="text"
						value={symbol}
						onChange={(e) => setSymbol(e.target.value)}
						placeholder="BTCUSDT"
					/>
				</label>
				<button onClick={handleLoad} disabled={!canLoad || loading}>
					{loading ? "Loading..." : "Load trades"}
				</button>
				{error && <div style={{ color: "red" }}>Error: {error}</div>}
			</div>

			{trades.length > 0 ? (
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Date</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Symbol</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Side</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Quantity</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Price</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Fee</th>
							<th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Realized P&L</th>
						</tr>
					</thead>
					<tbody>
						{trades.map((trade) => (
							<tr key={trade.id}>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.openedAt}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.symbol}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.side}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.quantity}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.price}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.fee}</td>
								<td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{trade.realizedPnl}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				!loading && <div>No trades loaded</div>
			)}
		</div>
	);
};

export default TradesListPage;
