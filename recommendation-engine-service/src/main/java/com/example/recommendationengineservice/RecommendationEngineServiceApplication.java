package com.example.recommendationengineservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class RecommendationEngineServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecommendationEngineServiceApplication.class, args);
	}

}
