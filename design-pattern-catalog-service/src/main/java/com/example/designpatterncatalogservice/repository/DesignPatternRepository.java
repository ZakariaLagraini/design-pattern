package com.example.designpatterncatalogservice.repository;

import com.example.designpatterncatalogservice.entity.DesignPattern;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesignPatternRepository extends JpaRepository<DesignPattern, Long> {
    List<DesignPattern> findByUserId(Long userId);
}
