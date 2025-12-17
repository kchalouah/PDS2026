package com.sesame.pds2026.predictionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PredictionServiceApplication {


	@org.springframework.context.annotation.Bean
	public org.springframework.web.client.RestTemplate restTemplate() {
		return new org.springframework.web.client.RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(PredictionServiceApplication.class, args);
	}

}
