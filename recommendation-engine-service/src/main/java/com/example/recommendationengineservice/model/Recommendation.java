package com.example.recommendationengineservice.model;


import java.util.List;


public class Recommendation {

    private String userId;
    private List<String> recommendedPatternIds;

    public Recommendation() {
    }

    public Recommendation(String userId, List<String> recommendedPatternIds) {
        this.userId = userId;
        this.recommendedPatternIds = recommendedPatternIds;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getRecommendedPatternIds() {
        return recommendedPatternIds;
    }

    public void setRecommendedPatternIds(List<String> recommendedPatternIds) {
        this.recommendedPatternIds = recommendedPatternIds;
    }
}