package com.example.designpatterncatalogservice.controller;

import com.example.designpatterncatalogservice.entity.DesignPattern;
import com.example.designpatterncatalogservice.service.DesignPatternService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/design_patterns")
public class DesignPatternController {

    @Autowired
    private DesignPatternService service;

    // Endpoint POST pour créer un DesignPattern
    @PostMapping
    public ResponseEntity<DesignPattern> createDesignPattern(@RequestBody DesignPattern designPattern) {
        DesignPattern savedDesignPattern = service.saveDesignPattern(designPattern.getUserId(), designPattern.getTexte());
        return ResponseEntity.ok(savedDesignPattern);
    }

    // Endpoint GET pour récupérer les textes des DesignPatterns par userId
    @GetMapping
    public ResponseEntity<List<String>> getDesignPatternTextsByUserId(@RequestParam Long userId) {
        List<DesignPattern> designPatterns = service.findDesignPatternsByUserId(userId);

        // Vérifie si aucun résultat n'est trouvé
        if (designPatterns.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        // Extrait uniquement les textes des DesignPatterns
        List<String> texts = designPatterns.stream()
                .map(DesignPattern::getTexte)
                .collect(Collectors.toList());

        return ResponseEntity.ok(texts);
    }
}
