package com.example.tradejournal.trade;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.example.tradejournal.exchange.ExchangeAccount;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "trades")
public class Trade {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "exchange_account_id")
	private ExchangeAccount exchangeAccount;

	private String symbol;

	@Enumerated(EnumType.STRING)
	private TradeSide side;

	private BigDecimal quantity;

	private BigDecimal price;

	private BigDecimal fee;

	private BigDecimal realizedPnl;

	private OffsetDateTime openedAt;

	private OffsetDateTime closedAt;
}
