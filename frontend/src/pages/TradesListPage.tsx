import React, { useMemo, useState } from "react";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
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
		<Box>
			<Typography variant="h5" component="h2" gutterBottom>
				Trades
			</Typography>

			<Paper sx={{ padding: 2, marginBottom: 3 }}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<TextField
						label="Account ID"
						type="number"
						value={accountId}
						onChange={(e) => setAccountId(e.target.value)}
						fullWidth
						required
					/>
					<TextField
						label="From (ISO)"
						type="text"
						value={from}
						onChange={(e) => setFrom(e.target.value)}
						fullWidth
						required
					/>
					<TextField
						label="To (ISO)"
						type="text"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						fullWidth
						required
					/>
					<TextField
						label="Symbol (optional)"
						type="text"
						value={symbol}
						onChange={(e) => setSymbol(e.target.value)}
						fullWidth
					/>
					<Button
						variant="contained"
						onClick={handleLoad}
						disabled={!canLoad || loading}
						sx={{ whiteSpace: "nowrap", minWidth: 140 }}
					>
						{loading ? "Loading..." : "Load trades"}
					</Button>
				</Stack>
				{error && (
					<Box mt={2}>
						<Alert severity="error">{error}</Alert>
					</Box>
				)}
			</Paper>

			{loading && (
				<Box display="flex" alignItems="center" gap={1}>
					<CircularProgress size={20} />
					<Typography>Loading...</Typography>
				</Box>
			)}

			{!loading && trades.length === 0 && (
				<Typography color="text.secondary">No trades loaded</Typography>
			)}

			{trades.length > 0 && (
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Symbol</TableCell>
								<TableCell>Side</TableCell>
								<TableCell>Quantity</TableCell>
								<TableCell>Price</TableCell>
								<TableCell>Fee</TableCell>
								<TableCell>Realized P&amp;L</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{trades.map((trade) => (
								<TableRow key={trade.id}>
									<TableCell>{trade.openedAt}</TableCell>
									<TableCell>{trade.symbol}</TableCell>
									<TableCell>{trade.side}</TableCell>
									<TableCell>{trade.quantity}</TableCell>
									<TableCell>{trade.price}</TableCell>
									<TableCell>{trade.fee}</TableCell>
									<TableCell>{trade.realizedPnl}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};

export default TradesListPage;
