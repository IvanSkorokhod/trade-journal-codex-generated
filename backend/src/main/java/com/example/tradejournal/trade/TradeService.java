package com.example.tradejournal.trade;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import com.example.tradejournal.exchange.ExchangeAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TradeService {

	private final TradeRepository tradeRepository;
	private final ExchangeAccountRepository exchangeAccountRepository;

	public List<Trade> getTrades(Long accountId, OffsetDateTime from, OffsetDateTime to, @Nullable String symbol) {
		exchangeAccountRepository.findById(accountId)
				.orElseThrow(() -> new IllegalArgumentException("Exchange account not found: " + accountId));

		return tradeRepository.findByAccountAndDateRange(accountId, from, to, symbol);
	}
}
