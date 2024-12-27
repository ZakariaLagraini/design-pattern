package com.example.recommendationengineservice.service;

import com.example.recommendationengineservice.model.Recommendation;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;


@Service
public class RecommendationServiceImpl implements RecommendationService {

    private Map<String, List<String>> userPatternInteractions = new HashMap<>();
    private Map<String, Recommendation> recommendationsCache = new HashMap<>();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Override
    public Recommendation getRecommendationForUser(String userId) {
        if(recommendationsCache.containsKey(userId)){
            return recommendationsCache.get(userId);
        }
        List<String> patternIds = getRecommendedPatternsBasedOnInteractions(userId);
        
        List<Recommendation.PatternRecommendation> recommendations = patternIds.stream()
            .map(id -> new Recommendation.PatternRecommendation(
                id,
                "Default code snippet for " + id,
                "Default explanation for " + id
            ))
            .collect(Collectors.toList());

        Recommendation recommendation = new Recommendation(userId, recommendations);
        recommendationsCache.put(userId, recommendation);
        return recommendation;
    }

    @Override
    public List<Recommendation> getAllRecommendations() {
        return new ArrayList<>(recommendationsCache.values());
    }

    @Override
    public void processUserInteraction(String userId, String patternId) {
        List<String> userInteractions =  userPatternInteractions.getOrDefault(userId,new ArrayList<>());
        userInteractions.add(patternId);
        userPatternInteractions.put(userId,userInteractions);
    }
    @Override
    public Recommendation getGeminiRecommendations(String codeSnippet) {
        String prompt = "Analyze the following project structure and code snippets to identify potential design patterns:\n" +
                codeSnippet +
                "\nProvide the following in your response:\n" +
                "1. Identified design patterns that could be applied\n" +
                "2. Explanation of why each pattern is suitable\n" +
                "3. Code examples showing how to implement these patterns\n" +
                "4. Potential benefits and trade-offs of applying each pattern\n" +
                "Format your response in a JSON object with 'patternName', 'codeSnippet', and 'explanation' properties.";
        
        String responseFromGemini = getGeminiResponse(prompt);
        return mapToRecommendation(responseFromGemini);
    }
    private Recommendation mapToRecommendation(String response) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            List<Recommendation.PatternRecommendation> recommendations = new ArrayList<>();
            
            if (rootNode.has("designPatterns")) {
                JsonNode patterns = rootNode.get("designPatterns");
                for (JsonNode pattern : patterns) {
                    recommendations.add(new Recommendation.PatternRecommendation(
                        pattern.get("patternName").asText(),
                        pattern.get("codeSnippet").asText(),
                        pattern.get("explanation").asText()
                    ));
                }
            }
            
            return new Recommendation("gemini", recommendations);
        } catch (Exception ex) {
            return new Recommendation("error", Collections.singletonList(
                new Recommendation.PatternRecommendation(
                    "Error",
                    "N/A",
                    "Error parsing response: " + ex.getMessage()
                )
            ));
        }
    }
    private String getGeminiResponse(String prompt) {
        try {
            URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            // Create request body
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            requestBody.put("contents", Collections.singletonList(content));

            String jsonInputString = mapper.writeValueAsString(requestBody);

            // Send request
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Read response
            StringBuilder response = new StringBuilder();
            try(BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }

            // Parse Gemini response
            JsonNode jsonNode = mapper.readTree(response.toString());
            String geminiText = jsonNode.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
            
            // Clean and format the response
            return formatGeminiResponse(geminiText);

        } catch (IOException e) {
            e.printStackTrace();
            return createErrorResponse(e.getMessage());
        }
    }

    private String formatGeminiResponse(String geminiText) {
        try {
            // Create a structured response
            Map<String, Object> response = new HashMap<>();
            List<Map<String, String>> patterns = new ArrayList<>();

            // Create a single pattern entry
            Map<String, String> pattern = new HashMap<>();
            pattern.put("patternName", "Design Pattern Analysis");
            pattern.put("codeSnippet", "See explanation for code examples");
            pattern.put("explanation", geminiText.replaceAll("```[^`]*```", "")  // Remove code blocks
                                              .replaceAll("`[^`]*`", "")         // Remove inline code
                                              .replaceAll("\n", " ")             // Remove newlines
                                              .trim());

            patterns.add(pattern);
            response.put("designPatterns", patterns);

            // Convert to JSON string
            return new ObjectMapper().writeValueAsString(response);
        } catch (Exception e) {
            return createErrorResponse("Error formatting response: " + e.getMessage());
        }
    }

    private String createErrorResponse(String errorMessage) {
        try {
            Map<String, Object> response = new HashMap<>();
            List<Map<String, String>> patterns = new ArrayList<>();
            Map<String, String> pattern = new HashMap<>();
            
            pattern.put("patternName", "Error");
            pattern.put("codeSnippet", "N/A");
            pattern.put("explanation", errorMessage);
            
            patterns.add(pattern);
            response.put("designPatterns", patterns);
            
            return new ObjectMapper().writeValueAsString(response);
        } catch (JsonProcessingException e) {
            return "{\"designPatterns\":[{\"patternName\":\"Error\",\"codeSnippet\":\"N/A\",\"explanation\":\"Failed to create error response\"}]}";
        }
    }

    private String extractDesignPattern(String response) {


        if(response.contains("No specific pattern identified")){
            return "No specific pattern identified";
        }
        return response;

    }

    private List<String> getRecommendedPatternsBasedOnInteractions(String userId) {
        List<String> userInteractions = userPatternInteractions.getOrDefault(userId, new ArrayList<>());
        if(userInteractions.isEmpty()) {
            return Arrays.asList("1", "2", "3"); // default if no interaction
        }

        // Example logic to generate recommendation based on interactions
        Map<String, Integer> patternCount = new HashMap<>();
        for(String patternId: userInteractions) {
            patternCount.put(patternId, patternCount.getOrDefault(patternId, 0) + 1);
        }
        
        return patternCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}