package com.example.recommendationengineservice.service;
import com.example.recommendationengineservice.model.Recommendation;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationServiceImpl implements RecommendationService {


    private Map<String, List<String>> userPatternInteractions = new HashMap<>();
    private Map<String, Recommendation> recommendationsCache = new HashMap<>();
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