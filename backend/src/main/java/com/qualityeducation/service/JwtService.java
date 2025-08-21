package com.qualityeducation.service;

import com.qualityeducation.model.User;
import com.qualityeducation.model.Supervisor;
import com.qualityeducation.model.Teacher;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Original method for User (keep this unchanged)
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("userType", "student"); // Add user type for differentiation
        return createToken(claims, user.getEmail());
    }

    // Method for Supervisor
    public String generateToken(Supervisor supervisor) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstName", supervisor.getFirstName());
        claims.put("lastName", supervisor.getLastName());
        claims.put("userType", "supervisor");
        claims.put("supervisorId", supervisor.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(supervisor.getEmail()) // This should be the email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // New method for Teacher
    public String generateToken(Teacher teacher) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstName", teacher.getFirstName());
        claims.put("lastName", teacher.getLastName());
        claims.put("userType", "teacher");
        claims.put("teacherId", teacher.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(teacher.getEmail()) // This should be the email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Alternative method using email string (for backward compatibility)
    public String generateTokenForSupervisor(String email, String supervisorId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("supervisorId", supervisorId);
        claims.put("userType", "supervisor");
        return createToken(claims, email);
    }

    // Method to generate token with email and role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // Make sure role is included
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, String userEmail) {
        final String username = extractUsername(token);
        return (username.equals(userEmail)) && !isTokenExpired(token);
    }

    // Method to extract supervisor ID from token
    public String extractSupervisorId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("supervisorId", String.class);
    }

    // New method to extract teacher ID from token
    public String extractTeacherId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("teacherId", String.class);
    }

    // Method to extract user type from token
    public String extractUserType(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userType", String.class);
    }
}