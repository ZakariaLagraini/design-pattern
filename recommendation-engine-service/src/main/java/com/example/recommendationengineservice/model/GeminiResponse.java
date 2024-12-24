package com.example.recommendationengineservice.model;

public class GeminiResponse {
    private String patternName;
    private String codeSnippet;
    private String explanation;

    public GeminiResponse() {
    }

    public GeminiResponse(String patternName, String codeSnippet, String explanation) {
        this.patternName = patternName;
        this.codeSnippet = codeSnippet;
        this.explanation = explanation;
    }

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