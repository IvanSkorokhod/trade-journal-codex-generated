import "./App.css";
import TradesListPage from "./pages/TradesListPage";
import { CssBaseline, Container, ThemeProvider, Typography, createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: { main: "#90caf9" },
		background: {
			default: "#121212",
			paper: "#1e1e1e",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Container maxWidth="lg" sx={{ paddingY: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Trade Journal
				</Typography>
				<TradesListPage />
			</Container>
		</ThemeProvider>
	);
}

export default App;
