package com.example.designpatterncatalogservice.repository;

import com.example.designpatterncatalogservice.entity.DesignPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignPatternRepository extends JpaRepository<DesignPattern, Long> {
}