package com.example.designpatterncatalogservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patterns")
public class DesignPattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String texte;

    // Constructeur par défaut
    public DesignPattern() {
    }

    // Constructeur avec paramètres
    public DesignPattern(Long userId, String texte) {
        this.userId = userId;
        this.texte = texte;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTexte() {
        return texte;
    }

    public void setTexte(String texte) {
        this.texte = texte;
    }
}
