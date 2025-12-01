package com.example.tradejournal.config;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.tradejournal.exchange.ExchangeAccount;
import com.example.tradejournal.exchange.ExchangeAccountRepository;
import com.example.tradejournal.trade.Trade;
import com.example.tradejournal.trade.TradeRepository;
import com.example.tradejournal.trade.TradeSide;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

	private final ExchangeAccountRepository exchangeAccountRepository;
	private final TradeRepository tradeRepository;

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		ExchangeAccount account = exchangeAccountRepository.findAll()
				.stream()
				.findFirst()
				.orElseGet(this::createDemoAccount);

		if (tradeRepository.count() == 0) {
			seedTrades(account);
		}
	}

	private ExchangeAccount createDemoAccount() {
		return exchangeAccountRepository.save(
				ExchangeAccount.builder()
						.name("Demo Binance Account")
						.exchangeType("BINANCE")
						.apiKey("demo-key")
						.apiSecret("demo-secret")
						.createdAt(OffsetDateTime.now())
						.build()
		);
	}

	private void seedTrades(ExchangeAccount account) {
		OffsetDateTime now = OffsetDateTime.now();
		String[] symbols = {"BTCUSDT", "ETHUSDT"};
		List<Trade> trades = new ArrayList<>();
		ThreadLocalRandom random = ThreadLocalRandom.current();

		IntStream.range(0, 40).forEach(i -> {
			String symbol = symbols[random.nextInt(symbols.length)];
			double basePrice = symbol.equals("BTCUSDT") ? 65000 : 3200;
			BigDecimal price = BigDecimal.valueOf(basePrice * (0.95 + random.nextDouble(0.0, 0.1)))
					.setScale(2, RoundingMode.HALF_UP);
			BigDecimal quantity = BigDecimal.valueOf(0.01 + random.nextDouble(0.0, 0.2))
					.setScale(4, RoundingMode.HALF_UP);
			BigDecimal fee = price.multiply(quantity).multiply(BigDecimal.valueOf(0.0004))
					.setScale(4, RoundingMode.HALF_UP);
			BigDecimal realizedPnl = BigDecimal.valueOf(random.nextDouble(-50.0, 50.0))
					.setScale(2, RoundingMode.HALF_UP);

			OffsetDateTime openedAt = now.minusDays(random.nextInt(30)).minusHours(random.nextInt(24));
			OffsetDateTime closedAt = openedAt.plusHours(random.nextInt(24)).plusMinutes(random.nextInt(60));

			trades.add(
					Trade.builder()
							.exchangeAccount(account)
							.symbol(symbol)
							.side(random.nextBoolean() ? TradeSide.BUY : TradeSide.SELL)
							.quantity(quantity)
							.price(price)
							.fee(fee)
							.realizedPnl(realizedPnl)
							.openedAt(openedAt)
							.closedAt(closedAt)
							.build()
			);
		});

		tradeRepository.saveAll(trades);
	}
}
