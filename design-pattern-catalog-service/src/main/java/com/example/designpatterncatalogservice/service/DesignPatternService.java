package com.example.designpatterncatalogservice.service;

import com.example.designpatterncatalogservice.entity.DesignPattern;
import com.example.designpatterncatalogservice.repository.DesignPatternRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesignPatternService {

    @Autowired
    private DesignPatternRepository repository;

    public DesignPattern saveDesignPattern(Long userId, String texte) {
        DesignPattern designPattern = new DesignPattern(userId, texte);
        return repository.save(designPattern);
    }
    public void deleteDesignPatternById(Long id) {
        repository.deleteById(id);
}

    public List<DesignPattern> findDesignPatternsByUserId(Long userId) {
        return repository.findByUserId(userId);
    }
}
