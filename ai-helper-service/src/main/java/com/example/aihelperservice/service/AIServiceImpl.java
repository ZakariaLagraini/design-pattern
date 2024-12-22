package com.example.aihelperservice.service;
import org.springframework.stereotype.Service;
@Service
public class AIServiceImpl implements  AIService{
    @Override
    public String generateResponse(String prompt) {
        // For now just returning prompt
        return prompt;
    }
}