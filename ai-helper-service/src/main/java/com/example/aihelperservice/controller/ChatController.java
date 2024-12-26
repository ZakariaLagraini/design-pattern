package com.example.aihelperservice.controller;

import com.example.aihelperservice.entities.GeminiRequest;
import com.example.aihelperservice.entities.GeminiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();


    @PostMapping("/ask")
    public ResponseEntity<GeminiResponse> askQuestion(@RequestBody String question) {
        // Prepare the request payload
        GeminiRequest requestPayload = new GeminiRequest();
        GeminiRequest.Content content = new GeminiRequest.Content();
        GeminiRequest.Content.Part part = new GeminiRequest.Content.Part();
        part.setText(question);
        content.setParts(List.of(part));
        requestPayload.setContents(List.of(content));

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Add API key as a query parameter
        String fullUrl = apiUrl + "?key=" + apiKey;

        HttpEntity<GeminiRequest> requestEntity = new HttpEntity<>(requestPayload, headers);

        try {
            // Send request to Gemini API
            ResponseEntity<String> response = restTemplate.exchange(fullUrl, HttpMethod.POST, requestEntity, String.class);

            // Log the raw response to check its structure
            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Raw Response Body: " + response.getBody());

            // If the response is not null or empty, try to deserialize it
            if (response.getBody() != null && !response.getBody().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                GeminiResponse geminiResponse = objectMapper.readValue(response.getBody(), GeminiResponse.class);
                return ResponseEntity.ok(geminiResponse);
            } else {
                System.out.println("No response body or contents from Gemini");
                return ResponseEntity.status(500).body(null);
            }
        } catch (Exception e) {
            // Log any exception that occurs
            System.out.println("Error occurred while calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }



}
