package com.sesame.pds2026.patientservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@org.springframework.data.jpa.repository.config.EnableJpaAuditing
public class PatientServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(PatientServiceApplication.class, args);
	}
}
