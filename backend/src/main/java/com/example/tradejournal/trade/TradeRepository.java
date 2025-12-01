package com.example.tradejournal.trade;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {

	@Query("""
			select t from Trade t
			where t.exchangeAccount.id = :accountId
			and t.openedAt between :from and :to
			and (:symbol is null or t.symbol = :symbol)
			""")
	List<Trade> findByAccountAndDateRange(
			@Param("accountId") Long accountId,
			@Param("from") OffsetDateTime from,
			@Param("to") OffsetDateTime to,
			@Param("symbol") String symbol
	);
}
