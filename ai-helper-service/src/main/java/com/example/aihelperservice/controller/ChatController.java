package com.example.aihelperservice.controller;

import com.example.aihelperservice.config.ChatbotConfig;
import com.example.aihelperservice.entities.GeminiRequest;
import com.example.aihelperservice.entities.GeminiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.PostConstruct;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ResourceLoader resourceLoader;
    private JsonNode chatbotInfo;

    public ChatController(RestTemplate restTemplate, ResourceLoader resourceLoader) {
        this.restTemplate = restTemplate;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource("classpath:chatbot-info.json");
            ObjectMapper mapper = new ObjectMapper();
            this.chatbotInfo = mapper.readTree(resource.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/ask")
    public ResponseEntity<GeminiResponse> askQuestion(@RequestBody String question) {
        String lowerQuestion = question.toLowerCase();

        // Check for creator-related questions first
        if (lowerQuestion.contains("creator") ||
                lowerQuestion.contains("who made") ||
                lowerQuestion.contains("who created") ||
                lowerQuestion.contains("developers")) {

            // Create a direct response using the JSON info
            GeminiResponse response = new GeminiResponse();
            GeminiResponse.Candidate candidate = new GeminiResponse.Candidate();
            GeminiResponse.Content content = new GeminiResponse.Content();
            GeminiResponse.Part part = new GeminiResponse.Part();

            JsonNode creators = chatbotInfo.path("chatbot_details").path("company").path("creators");
            JsonNode school = chatbotInfo.path("chatbot_details").path("company").path("school");

            StringBuilder responseText = new StringBuilder();
            responseText.append("This chatbot was created by a team of talented developers from ")
                    .append(school.asText())
                    .append(". The creators are: ");

            if (creators.isArray()) {
                for (int i = 0; i < creators.size(); i++) {
                    responseText.append(creators.get(i).asText());
                    if (i < creators.size() - 2) {
                        responseText.append(", ");
                    } else if (i == creators.size() - 2) {
                        responseText.append(" and ");
                    }
                }
            }

            part.setText(responseText.toString());
            content.setParts(List.of(part));
            content.setRole("model");
            candidate.setContent(content);
            candidate.setFinishReason("STOP");
            response.setCandidates(List.of(candidate));

            return ResponseEntity.ok(response);
        }

        // For other questions, proceed with the Gemini API call
        GeminiRequest requestPayload = new GeminiRequest();
        GeminiRequest.Content content = new GeminiRequest.Content();
        GeminiRequest.Content.Part part = new GeminiRequest.Content.Part();
        part.setText(buildContextualPrompt(lowerQuestion));
        content.setParts(List.of(part));
        requestPayload.setContents(List.of(content));

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String fullUrl = apiUrl + "?key=" + apiKey;
        HttpEntity<GeminiRequest> requestEntity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    fullUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class);

            if (response.getBody() != null && !response.getBody().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                GeminiResponse geminiResponse = objectMapper.readValue(
                        response.getBody(),
                        GeminiResponse.class);
                return ResponseEntity.ok(geminiResponse);
            }
            return ResponseEntity.status(500).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    private String buildContextualPrompt(String question) {
        // Build a context-aware prompt
        StringBuilder prompt = new StringBuilder();
        prompt.append("Based on the following information about our chatbot, please provide a helpful response to: ")
                .append(question)
                .append("\n\nChatbot Information:\n")
                .append(chatbotInfo.toString())
                .append("\n\nPlease ensure the response is:")
                .append("\n- Professional and courteous")
                .append("\n- Clear and easy to understand")
                .append("\n- Relevant to the customer's question")
                .append("\n- Based only on the information provided above");

        return prompt.toString();
    }
}
