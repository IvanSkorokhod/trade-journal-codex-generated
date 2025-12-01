package com.example.tradejournal.health;

import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	private final JdbcTemplate jdbcTemplate;

	public HealthController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@GetMapping("/db")
	public Map<String, Object> dbHealth() {
		Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
		Map<String, Object> payload = new HashMap<>();
		payload.put("status", "OK");
		payload.put("db", result);
		return payload;
	}
}
