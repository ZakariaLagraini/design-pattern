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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


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
        List<String> patternIds = new ArrayList<>(getRecommendedPatternsBasedOnInteractions(userId));

        Recommendation recommendation = new Recommendation(userId, patternIds);
        recommendationsCache.put(userId,recommendation);
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
        String prompt = "Analyze the following code snippet and apply the most suitable design pattern:\n" +
                codeSnippet +
                "\nIf a design pattern is applicable, provide the name of the design pattern, a modified code snippet that implements the identified design pattern and a brief explanation of why this pattern fits the code. Format your response in a JSON object with 'patternName', 'codeSnippet' and 'explanation' properties. If no design pattern is applicable, respond with 'No specific pattern identified'.";
        String responseFromGemini =  getGeminiResponse(prompt);
        return  mapToRecommendation(responseFromGemini);

    }
    private Recommendation mapToRecommendation(String response){
        ObjectMapper objectMapper = new ObjectMapper();
        try{
            Map<String, String> map = objectMapper.readValue(response, new TypeReference<Map<String, String>>() {});
            List<String> list = new ArrayList<>();
            if (map.containsKey("patternName")){
                list.add(map.get("patternName"));
            }
            if (map.containsKey("codeSnippet")) {
                list.add(map.get("codeSnippet"));
            }
            if (map.containsKey("explanation")) {
                list.add(map.get("explanation"));
            }
            return new Recommendation("gemini", list);

        }catch (Exception ex){
            return new Recommendation("gemini", Collections.singletonList(response));
        }


    }
    private String getGeminiResponse(String prompt) {
        try {
            System.out.println("Using Gemini API Key:" + geminiApiKey);
            System.out.println("Gemini API prompt is: " + prompt);
            URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey);
            System.out.println("Gemini API url is: " + url);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            System.out.println("Connection headers are set.");
            con.setDoOutput(true);


            // Using ObjectMapper to create JSON payload
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> jsonMap = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String,String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);
            content.put("parts",parts);
            contents.add(content);
            jsonMap.put("contents",contents);


            String jsonInputString = mapper.writeValueAsString(jsonMap);


            System.out.println("Gemini API json is: " + jsonInputString);
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
                System.out.println("JSON was written successfully to the output stream");
            }

            StringBuilder response = new StringBuilder();
            System.out.println("Reading response from Gemini");
            try(BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }
            System.out.println("Response read from gemini api : " + response);
            JsonNode jsonNode = mapper.readTree(response.toString());
            System.out.println("Json node is " + jsonNode.toString());
            String text = jsonNode.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();

            String patternName = extractDesignPattern(text);
            return patternName;

        } catch (IOException e) {
            System.out.println("Error while generating AI response: " + e.getMessage());
            return "Error: Unable to generate response from Gemini API.";
        }
    }

    private String extractDesignPattern(String response) {


        if(response.contains("No specific pattern identified")){
            return "No specific pattern identified";
        }
        return response;

    }

    private List<String> getRecommendedPatternsBasedOnInteractions(String userId){
        List<String> userInteractions = userPatternInteractions.getOrDefault(userId,new ArrayList<>());
        if(userInteractions.isEmpty()){
            return Arrays.asList("1","2","3"); // default if no interaction
        }

        // Example logic to generate recommendation based on interactions
        Map<String,Integer> patternCount = new HashMap<>();
        for(String patternId: userInteractions){
            patternCount.put(patternId, patternCount.getOrDefault(patternId,0)+1);
        }
        List<String> sortedPatterns = patternCount.entrySet().stream()
                .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();
        return sortedPatterns;
    }
}