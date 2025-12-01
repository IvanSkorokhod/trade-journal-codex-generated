package com.example.tradejournal.trade;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TradeDto {
	Long id;
	Long exchangeAccountId;
	String symbol;
	String side;
	BigDecimal quantity;
	BigDecimal price;
	BigDecimal fee;
	BigDecimal realizedPnl;
	OffsetDateTime openedAt;
	OffsetDateTime closedAt;

	public static TradeDto fromEntity(Trade trade) {
		return TradeDto.builder()
				.id(trade.getId())
				.exchangeAccountId(trade.getExchangeAccount() != null ? trade.getExchangeAccount().getId() : null)
				.symbol(trade.getSymbol())
				.side(trade.getSide() != null ? trade.getSide().name() : null)
				.quantity(trade.getQuantity())
				.price(trade.getPrice())
				.fee(trade.getFee())
				.realizedPnl(trade.getRealizedPnl())
				.openedAt(trade.getOpenedAt())
				.closedAt(trade.getClosedAt())
				.build();
	}
}
