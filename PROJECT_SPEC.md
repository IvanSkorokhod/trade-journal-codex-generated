# Trade Journal POC – Specification for AI

This document describes the "Trade Journal" POC application and should be used by AI assistants (Copilot, Cursor, ChatGPT, etc.) as the main context when generating code.

---

## 1. Project Goal

Create a simple POC trade journal for a trader with automatic fetching of trade history from an exchange and basic analytics.

This is an **MVP / POC**, not a production system:
- single user or a very simple user model;
- minimal sufficient architecture;
- the main focus is working functionality, not perfect code quality.

---

## 2. Technology Stack

**Backend**
- Language: Java  
- Framework: Spring Boot (latest stable version)
- Build tool: Maven or Gradle (choose one and use it consistently)
- Database access: Spring Data JPA
- DB: PostgreSQL (can be replaced if there is a good reason)
- API format: REST + JSON

**Frontend**
- React + TypeScript
- Package manager: npm / yarn (important to be consistent)
- UI library: any lightweight one (e.g., MUI, or no library – simple custom UI)
- Charts: chart library (e.g., recharts / chart.js)

---

## 3. Core Functionality (MVP)

1. **Exchange API connection**
   - Support at least one exchange (e.g., Binance or Bybit).
   - User enters API key / Secret key.
   - Keys are stored in the database in a secure way (at minimum – encrypted).

2. **Fetching trade history**
   - Backend calls the exchange API.
   - Saves trades into the local database.
   - Ability to periodically update history (e.g., via a “Refresh” button).

3. **Balance and P&L display**
   - Current account balance.
   - P&L for the selected period:
     - in percentage;
     - in currency (USDT / USD or base account currency).

4. **Cumulative profit chart**
   - Line/curve of cumulative P&L over time.
   - Based on trade data (realized profit/loss).

5. **Key metrics**
   - Number of trades for the selected period.
   - Win rate (percentage of profitable trades).
   - Average win / loss size (if possible).

6. **Analysis period selection**
   - Filter data by period:
     - presets: "Today", "Week", "Month", "All time";
     - custom period (start date / end date).
   - All reports, charts, and metrics must respect the selected period.

---

## 4. Domain Model (draft)

Models can be refined during development, but basic entities:

- `ExchangeAccount`
  - id
  - exchangeType (BINANCE, BYBIT, …)
  - apiKey
  - apiSecret (stored encrypted)
  - createdAt

- `Trade`
  - id
  - exchangeAccountId (relation to ExchangeAccount)
  - symbol (e.g., BTCUSDT)
  - side (BUY/SELL)
  - quantity
  - price
  - fee
  - realizedPnl
  - openedAt
  - closedAt (if applicable)
  - rawData (optional: JSON with original exchange response)

- `BalanceSnapshot` (optional for POC)
  - id
  - exchangeAccountId
  - totalBalance
  - currency
  - createdAt

---

## 5. API (draft contract)

Approximate REST API structure:

### 5.1. Exchange accounts

- `POST /api/exchange-accounts`
  - Create an account (store API keys).
- `GET /api/exchange-accounts`
  - Get a list of connected accounts.
- `POST /api/exchange-accounts/{id}/sync-trades`
  - Trigger synchronization of trade history with the exchange.

### 5.2. Trades and statistics

- `GET /api/trades`
  - Parameters: `accountId`, `from`, `to`, `symbol?`
  - Returns a list of trades for the period.

- `GET /api/stats/summary`
  - Parameters: `accountId`, `from`, `to`
  - Returns:
    - number of trades,
    - win rate,
    - total P&L in currency,
    - total P&L in %.

- `GET /api/stats/equity-curve`
  - Parameters: `accountId`, `from`, `to`
  - Returns an array of points (timestamp, cumulativePnl).

- `GET /api/balance`
  - Parameters: `accountId`
  - Current balance and, if possible, breakdown by assets.

---

## 6. Frontend – pages and components

### Main pages

1. **Exchange connection page**
   - Form to enter API key / Secret.
   - List of already added accounts.
   - “Sync trades” button.

2. **Dashboard**
   - Account selector.
   - Period selector (date range + presets).
   - Cards:
     - current balance;
     - P&L for the period (currency and %);
     - number of trades;
     - win rate.
   - Cumulative profit chart (equity curve).

3. **Trades list**
   - Table with pagination/filters:
     - date;
     - instrument (symbol);
     - side (BUY/SELL);
     - size;
     - price;
     - fee;
     - trade P&L.

---

## 7. Non-functional requirements (for POC)

- UI language: a single language is enough (e.g., English).
- Authentication: can be simplified (one test user) or even omitted if not critical.
- Error logging on backend (at least logging requests to the exchange and errors).
- Simple but neat UI (no complex layout).

---

## 8. Important notes for AI

When generating code:

1. Respect the chosen stack:
   - Java + Spring Boot on backend;
   - React + TypeScript on frontend.

2. Generate **complete files** (with imports), not just isolated snippets.

3. Use consistent, logical naming for packages, classes, and components:
   - backend: `com.example.tradejournal` (can be changed but must be consistent);
   - frontend: structure with `components`, `pages`, `services/api`.

4. For exchange integration:
   - create an `ExchangeClient` abstraction and concrete implementations (`BinanceClient`, `BybitClient`, etc.);
   - at POC stage, stub or simplify data if it speeds up development.

---

## 9. Out of scope for this POC (can be explicitly ignored)

- Production-level security and secret storage by all best practices (basic level is enough).
- Full multi-user support with registration/roles.
- Support for many exchanges (1–2 are enough for demonstration).
- Complex reports and custom strategies.

