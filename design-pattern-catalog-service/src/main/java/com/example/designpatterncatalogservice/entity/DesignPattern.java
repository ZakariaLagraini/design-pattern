package com.example.designpatterncatalogservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "design_patterns")

public class DesignPattern {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String intent;
    private String benefits;
    private String drawbacks;
    private String relatedPatterns;
    private String category;

    public DesignPattern() {
    }

    public DesignPattern(Long id, String name, String description, String intent, String benefits, String drawbacks, String relatedPatterns, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.intent = intent;
        this.benefits = benefits;
        this.drawbacks = drawbacks;
        this.relatedPatterns = relatedPatterns;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getDrawbacks() {
        return drawbacks;
    }

    public void setDrawbacks(String drawbacks) {
        this.drawbacks = drawbacks;
    }

    public String getRelatedPatterns() {
        return relatedPatterns;
    }

    public void setRelatedPatterns(String relatedPatterns) {
        this.relatedPatterns = relatedPatterns;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}