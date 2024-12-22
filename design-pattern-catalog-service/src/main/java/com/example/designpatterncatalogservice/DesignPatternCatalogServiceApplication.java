package com.example.designpatterncatalogservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class DesignPatternCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DesignPatternCatalogServiceApplication.class, args);
	}

}
