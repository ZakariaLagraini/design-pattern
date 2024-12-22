package com.example.designpatterncatalogservice.controller;

import com.example.designpatterncatalogservice.entity.DesignPattern;
import com.example.designpatterncatalogservice.repository.DesignPatternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patterns")
public class DesignPatternController {

    private final DesignPatternRepository patternRepository;

    @Autowired
    public DesignPatternController(DesignPatternRepository patternRepository) {
        this.patternRepository = patternRepository;
    }

    @GetMapping
    public ResponseEntity<List<DesignPattern>> getAllPatterns(){
        return ResponseEntity.ok(patternRepository.findAll());
    }


    @PostMapping
    public ResponseEntity<DesignPattern> addPattern(@RequestBody DesignPattern pattern) {
        DesignPattern savedPattern = patternRepository.save(pattern);
        return ResponseEntity.ok(savedPattern);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignPattern> getPatternById(@PathVariable Long id){
        Optional<DesignPattern> pattern = patternRepository.findById(id);
        return pattern.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

}