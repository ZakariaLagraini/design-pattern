package com.example.recommendationengineservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class Recommendation {
    private String userId;
    private List<PatternRecommendation> recommendations;



    public Recommendation(String userId, List<PatternRecommendation> recommendations) {
        this.userId = userId;
        this.recommendations = recommendations;
    }

    // Getters and setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @JsonProperty("recommendedPatternIds")
    public List<PatternRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<PatternRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    // Inner class for pattern recommendations
    public static class PatternRecommendation {
        private String patternName;
        private String codeSnippet;
        private String explanation;

        // Constructors, getters, and setters
        public PatternRecommendation() {
        }

        public PatternRecommendation(String patternName, String codeSnippet, String explanation) {
            this.patternName = patternName;
            this.codeSnippet = codeSnippet;
            this.explanation = explanation;
        }

        // Getters and setters
        public String getPatternName() {
            return patternName;
        }

        public void setPatternName(String patternName) {
            this.patternName = patternName;
        }

        public String getCodeSnippet() {
            return codeSnippet;
        }

        public void setCodeSnippet(String codeSnippet) {
            this.codeSnippet = codeSnippet;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }
}