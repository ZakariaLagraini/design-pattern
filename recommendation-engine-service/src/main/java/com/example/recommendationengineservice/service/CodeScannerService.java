package com.example.recommendationengineservice.service;

import com.example.recommendationengineservice.model.ProjectAnalysis;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Stream;

@Service
public class CodeScannerService {
    
    @Value("${scanner.file.extensions}")
    private String[] allowedExtensions;

    @Value("${scanner.exclude.patterns}")
    private String[] excludePatterns;

    public ProjectAnalysis analyzeProject(String directoryPath) throws IOException {
        Map<String, String> fileContents = scanDirectory(directoryPath);
        return analyzeCodeStructure(fileContents);
    }

    private ProjectAnalysis analyzeCodeStructure(Map<String, String> fileContents) {
        ProjectAnalysis analysis = new ProjectAnalysis();
        
        // Analyze class relationships
        for (Map.Entry<String, String> entry : fileContents.entrySet()) {
            String content = entry.getValue();
            
            // Check for common patterns
            if (content.contains("@Controller") || content.contains("@RestController")) {
                analysis.addPattern("MVC/REST Pattern", "Controller layer identified");
            }
            
            if (content.contains("@Service")) {
                analysis.addPattern("Service Layer Pattern", "Business logic layer identified");
            }
            
            if (content.contains("Repository")) {
                analysis.addPattern("Repository Pattern", "Data access layer identified");
            }
            
            if (content.contains("@Autowired")) {
                analysis.addPattern("Dependency Injection", "Spring DI in use");
            }
            
            // Check for potential pattern opportunities
            if (content.contains("new") && content.contains("getInstance")) {
                analysis.addSuggestion("Singleton Pattern", 
                    "Consider using Spring's singleton scope instead of manual implementation");
            }
            
            if (content.contains("if") && content.contains("instanceof")) {
                analysis.addSuggestion("Strategy Pattern", 
                    "Consider replacing type checks with strategy pattern");
            }
        }
        
        return analysis;
    }

    public String generateProjectAnalysis(Map<String, String> fileContents) {
        StringBuilder codeAnalysis = new StringBuilder();
        codeAnalysis.append("Project Structure Analysis:\n\n");

        // Add file contents for analysis
        for (Map.Entry<String, String> entry : fileContents.entrySet()) {
            codeAnalysis.append("File: ").append(entry.getKey()).append("\n");
            codeAnalysis.append("Content:\n").append(entry.getValue()).append("\n\n");
        }

        // Add relationships and dependencies
        codeAnalysis.append("\nClass Dependencies and Relationships:\n");
        analyzeRelationships(fileContents, codeAnalysis);

        return codeAnalysis.toString();
    }

    private void analyzeRelationships(Map<String, String> fileContents, StringBuilder analysis) {
        for (Map.Entry<String, String> entry : fileContents.entrySet()) {
            String content = entry.getValue();
            
            // Extract imports and class relationships
            Arrays.stream(content.split("\n"))
                  .filter(line -> line.trim().startsWith("import") || 
                                line.contains("extends") || 
                                line.contains("implements"))
                  .forEach(line -> analysis.append(line).append("\n"));
        }
    }

    public Map<String, String> scanDirectory(String directoryPath) throws IOException {
        Map<String, String> fileContents = new HashMap<>();
        
        try (Stream<Path> paths = Files.walk(Paths.get(directoryPath))) {
            paths.filter(Files::isRegularFile)
                 .filter(path -> path.toString().endsWith(".java"))
                 .forEach(path -> {
                     try {
                         String content = Files.readString(path);
                         fileContents.put(path.getFileName().toString(), content);
                     } catch (IOException e) {
                         e.printStackTrace();
                     }
                 });
        }
        
        return fileContents;
    }

    private boolean isAllowedFile(Path path) {
        String fileName = path.toString().toLowerCase();
        return Arrays.stream(allowedExtensions)
                    .anyMatch(fileName::endsWith);
    }

    private boolean isNotExcluded(Path path) {
        String pathStr = path.toString();
        return Arrays.stream(excludePatterns)
                    .noneMatch(pattern -> 
                        FileSystems.getDefault()
                                 .getPathMatcher("glob:" + pattern)
                                 .matches(path));
    }
} 