package com.example.tradejournal.trade;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
public class TradeController {

	private final TradeService tradeService;

	@GetMapping
	public ResponseEntity<List<TradeDto>> getTrades(
			@RequestParam Long accountId,
			@RequestParam String from,
			@RequestParam String to,
			@RequestParam(required = false) String symbol
	) {
		OffsetDateTime fromDateTime = OffsetDateTime.parse(from);
		OffsetDateTime toDateTime = OffsetDateTime.parse(to);

		List<TradeDto> result = tradeService.getTrades(accountId, fromDateTime, toDateTime, symbol)
				.stream()
				.map(TradeDto::fromEntity)
				.toList();

		return ResponseEntity.ok(result);
	}
}
