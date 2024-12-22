package com.example.usermanagementservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Securely generate a 256-bit key
    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token validity period (1 day in milliseconds)
    private final long EXPIRATION_TIME = 86400000L;


    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                          // Set the subject
                .setIssuedAt(new Date())                       // Set the issued time
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Set the expiration time
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Sign the token
                .compact();
    }


    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Log exception for debugging in a real application
            System.out.println("Invalid JWT token: " + e.getMessage());
            return false;
        }
    }
}
