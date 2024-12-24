package com.example.recommendationengineservice.service;

import com.example.recommendationengineservice.model.Recommendation;

import java.util.List;

public interface RecommendationService {

    Recommendation getRecommendationForUser(String userId);

    List<Recommendation> getAllRecommendations();

    void processUserInteraction(String userId, String patternId);
    Recommendation getGeminiRecommendations(String codeSnippet);
}