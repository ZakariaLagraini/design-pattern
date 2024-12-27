package com.example.recommendationengineservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import com.example.recommendationengineservice.service.CodeScannerService;

@Configuration
public class ScannerConfig {
    
    @Bean
    public CodeScannerService codeScannerService() {
        return new CodeScannerService();
    }
} 