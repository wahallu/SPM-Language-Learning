package com.qualityeducation.service;

import com.qualityeducation.model.User;
import com.qualityeducation.model.Supervisor;
import com.qualityeducation.model.Teacher;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        // Ensure the key is at least 256 bits (32 bytes) for HS256
        if (keyBytes.length < 32) {
            log.warn("JWT secret key is shorter than recommended 256 bits. Consider using a longer key.");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            log.error("Failed to extract username from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw new RuntimeException("JWT token is expired");
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            throw new RuntimeException("JWT token is unsupported");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            throw new RuntimeException("JWT claims string is empty");
        }
    }

    private Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            log.error("Error checking token expiration: {}", e.getMessage());
            return true;
        }
    }

    // New method to check if token is valid without throwing exceptions
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Original method for User (keep this unchanged)
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("userType", "student");
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("currentLevel", user.getCurrentLevel());
        claims.put("totalXP", user.getTotalXP());
        return createToken(claims, user.getEmail());
    }

    // Method for Supervisor
    public String generateToken(Supervisor supervisor) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstName", supervisor.getFirstName());
        claims.put("lastName", supervisor.getLastName());
        claims.put("userType", "supervisor");
        claims.put("supervisorId", supervisor.getId());

        return createToken(claims, supervisor.getEmail());
    }

    // Method for Teacher
    public String generateToken(Teacher teacher) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstName", teacher.getFirstName());
        claims.put("lastName", teacher.getLastName());
        claims.put("userType", "teacher");
        claims.put("teacherId", teacher.getId());

        return createToken(claims, teacher.getEmail());
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
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error("Error creating JWT token: {}", e.getMessage());
            throw new RuntimeException("Failed to create JWT token");
        }
    }

    public Boolean validateToken(String token, String userEmail) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userEmail)) && !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Token validation failed for user {}: {}", userEmail, e.getMessage());
            return false;
        }
    }

    // Method to extract supervisor ID from token
    public String extractSupervisorId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("supervisorId", String.class);
        } catch (Exception e) {
            log.error("Failed to extract supervisor ID from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        }
    }

    // New method to extract teacher ID from token
    public String extractTeacherId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("teacherId", String.class);
        } catch (Exception e) {
            log.error("Failed to extract teacher ID from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        }
    }

    // Method to extract user ID from token
    public String extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("userId", String.class);
        } catch (Exception e) {
            log.error("Failed to extract user ID from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        }
    }

    // Method to extract user type from token
    public String extractUserType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String userType = claims.get("userType", String.class);
            return userType != null ? userType : "student"; // Default fallback
        } catch (Exception e) {
            log.error("Failed to extract user type from token: {}", e.getMessage());
            return "student"; // Default fallback
        }
    }
}