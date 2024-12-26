package com.example.recommendationengineservice.model;

import java.util.*;

public class ProjectAnalysis {
    private List<PatternInfo> identifiedPatterns = new ArrayList<>();
    private List<PatternInfo> suggestedPatterns = new ArrayList<>();
    
    public void addPattern(String name, String details) {
        identifiedPatterns.add(new PatternInfo(name, details));
    }
    
    public void addSuggestion(String name, String suggestion) {
        suggestedPatterns.add(new PatternInfo(name, suggestion));
    }
    
    public List<PatternInfo> getIdentifiedPatterns() {
        return identifiedPatterns;
    }
    
    public List<PatternInfo> getSuggestedPatterns() {
        return suggestedPatterns;
    }
    
    public static class PatternInfo {
        private String name;
        private String details;
        
        public PatternInfo(String name, String details) {
            this.name = name;
            this.details = details;
        }
        
        // Add getters
        public String getName() {
            return name;
        }
        
        public String getDetails() {
            return details;
        }
        
        // Add setters
        public void setName(String name) {
            this.name = name;
        }
        
        public void setDetails(String details) {
            this.details = details;
        }
    }
} 