package com.example.aihelperservice.config;

import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class ChatbotConfig {
    public static final Map<String, String> PREDEFINED_RESPONSES = new HashMap<>();

    static {
        PREDEFINED_RESPONSES.put("creators",
                "Our chatbot was developed by a dedicated team of software engineers who specialize in AI and customer service solutions. "
                        +
                        "We're committed to providing the best possible customer service experience.");

        PREDEFINED_RESPONSES.put("about",
                "This is an intelligent customer service chatbot powered by Google's Gemini AI. " +
                        "I'm here to help answer your questions and provide assistance with any issues you might have.");
    }
}