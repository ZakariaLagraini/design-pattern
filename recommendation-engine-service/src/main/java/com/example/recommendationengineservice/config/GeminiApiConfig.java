package com.example.recommendationengineservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;

@Configuration
public class GeminiApiConfig {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public String getApiKey() {
        return apiKey;
    }

    @Bean
    public String getGeminiPrompt() {
        return """
            You are a design pattern expert. Analyze the provided code and create a detailed JSON response.
            
            Instructions:
            1. Identify design patterns from the code structure
            2. Extract actual code examples that demonstrate each pattern
            3. Provide clear explanations of how each pattern is implemented
            
            Rules:
            - Focus only on clear pattern implementations in the code
            - Include specific code snippets from the provided source
            - Explain practical benefits of each pattern found
            
            Required JSON format:
            {
                "designPatterns": [
                    {
                        "patternName": "Pattern Name",
                        "category": "Creational/Structural/Behavioral",
                        "codeSnippet": "Actual code from the source showing the pattern",
                        "explanation": "Detailed explanation of the pattern implementation",
                        "benefits": "Practical benefits in this context"
                    }
                ]
            }
            
            Analyze the following code structure:
            """;
    }
}
