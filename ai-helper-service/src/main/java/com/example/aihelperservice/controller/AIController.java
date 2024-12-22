package com.example.aihelperservice.controller;
import com.example.aihelperservice.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService){
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateAIResponse(@RequestBody String prompt){
        return ResponseEntity.ok(aiService.generateResponse(prompt));
    }
}