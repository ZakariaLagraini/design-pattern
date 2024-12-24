package com.example.recommendationengineservice.controller;

import com.example.recommendationengineservice.model.Recommendation;
import com.example.recommendationengineservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService){
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Recommendation> getRecommendationForUser(@PathVariable String userId){
        Recommendation recommendation =  recommendationService.getRecommendationForUser(userId);
        return ResponseEntity.ok(recommendation);
    }
    @GetMapping
    public ResponseEntity<List<Recommendation>> getAllRecommendations(){
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }
    @PostMapping("/interactions/{userId}/{patternId}")
    public ResponseEntity<String> processUserInteraction(@PathVariable String userId, @PathVariable String patternId)
    {
        recommendationService.processUserInteraction(userId, patternId);
        return ResponseEntity.ok("Interaction processed successfully");
    }

    @PostMapping("/gemini")
    public ResponseEntity<Recommendation> getGeminiRecommendations(@RequestBody String codeSnippet){
        return ResponseEntity.ok(recommendationService.getGeminiRecommendations(codeSnippet));
    }
}