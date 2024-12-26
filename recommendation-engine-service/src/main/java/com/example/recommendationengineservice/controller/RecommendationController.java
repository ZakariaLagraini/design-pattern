package com.example.recommendationengineservice.controller;

import com.example.recommendationengineservice.model.ProjectAnalysis;
import com.example.recommendationengineservice.model.Recommendation;
import com.example.recommendationengineservice.service.RecommendationService;
import com.example.recommendationengineservice.service.CodeScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
//import java.nio.file.FileSystemUtils;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final CodeScannerService codeScannerService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService, CodeScannerService codeScannerService){
        this.recommendationService = recommendationService;
        this.codeScannerService = codeScannerService;
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

    @PostMapping("/analyze")
    public ResponseEntity<Recommendation> analyzeUploadedProject(
            @RequestParam("sourceFiles") MultipartFile[] files) {
        try {
            // Create a temporary directory to store uploaded files
            Path tempDir = Files.createTempDirectory("project_analysis_");
            
            // Process each uploaded file
            for (MultipartFile file : files) {
                if (file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".java")) {
                    Path filePath = tempDir.resolve(file.getOriginalFilename());
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                }
            }

            // Scan the directory and analyze
            Map<String, String> sourceCode = codeScannerService.scanDirectory(tempDir.toString());
            String analysis = codeScannerService.generateProjectAnalysis(sourceCode);
            
            // Clean up temporary directory
            FileSystemUtils.deleteRecursively(tempDir);

            return ResponseEntity.ok(recommendationService.getGeminiRecommendations(analysis));
        } catch (IOException e) {
            List<Recommendation.PatternRecommendation> errorList = Collections.singletonList(
                new Recommendation.PatternRecommendation(
                    "Error",
                    "N/A",
                    e.getMessage()
                )
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Recommendation("error", errorList));
        }
    }

    @PostMapping("/analyze-path")
    public ResponseEntity<Recommendation> analyzeProjectPath(@RequestParam String projectPath) {
        try {
            Map<String, String> sourceCode = codeScannerService.scanDirectory(projectPath);
            String analysis = codeScannerService.generateProjectAnalysis(sourceCode);
            return ResponseEntity.ok(recommendationService.getGeminiRecommendations(analysis));
        } catch (IOException e) {
            List<Recommendation.PatternRecommendation> errorList = Collections.singletonList(
                new Recommendation.PatternRecommendation(
                    "Error",
                    "N/A",
                    e.getMessage()
                )
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Recommendation("error", errorList));
        }
    }

    @PostMapping("/analyze-project")
    public ResponseEntity<Recommendation> analyzeProject(@RequestParam("projectPath") String projectPath) {
        try {
            // Scan and analyze project
            Map<String, String> sourceCode = codeScannerService.scanDirectory(projectPath);
            String analysis = codeScannerService.generateProjectAnalysis(sourceCode);
            
            // Get AI recommendations based on pure code analysis
            return ResponseEntity.ok(recommendationService.getGeminiRecommendations(analysis));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Recommendation("error", Collections.singletonList(
                        new Recommendation.PatternRecommendation(
                            "Error",
                            "N/A",
                            "Error analyzing project: " + e.getMessage()
                        )
                    )));
        }
    }
}