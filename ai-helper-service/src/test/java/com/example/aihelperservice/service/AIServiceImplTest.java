package com.example.aihelperservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AIServiceImplTest {

    private AIService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AIServiceImpl();
    }

    @Test
    void generateResponse_ReturnsPrompt() {
        // Arrange
        String prompt = "Test prompt";

        // Act
        String response = aiService.generateResponse(prompt);

        // Assert
        assertEquals(prompt, response);
    }
} 