package com.example.aihelperservice.controller;

import com.example.aihelperservice.entities.GeminiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

class ChatControllerTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void askQuestion_Success() {
        // Arrange
        String question = "What is Java?";
        String mockResponse = """
            {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": "Java is a programming language"
                        }]
                    }
                }]
            }""";
        
        when(restTemplate.exchange(
            any(String.class),
            any(),
            any(),
            eq(String.class)
        )).thenReturn(ResponseEntity.ok(mockResponse));

        // Act
        ResponseEntity<GeminiResponse> response = chatController.askQuestion(question);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getCandidates());
        assertFalse(response.getBody().getCandidates().isEmpty());
    }

    @Test
    void askQuestion_Error() {
        // Arrange
        String question = "What is Java?";
        when(restTemplate.exchange(
            any(String.class),
            any(),
            any(),
            eq(String.class)
        )).thenThrow(new RuntimeException("API Error"));

        // Act
        ResponseEntity<GeminiResponse> response = chatController.askQuestion(question);

        // Assert
        assertNotNull(response);
        assertEquals(500, response.getStatusCodeValue());
        assertNull(response.getBody());
    }
} 