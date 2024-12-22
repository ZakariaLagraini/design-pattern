package com.example.aihelperservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class AiHelperServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiHelperServiceApplication.class, args);
    }

}
