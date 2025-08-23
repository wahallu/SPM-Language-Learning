package com.qualityeducation.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String username;
    private String role; // Add role field
    private String message;
    private boolean success;

    // Constructors
    public AuthResponse(String message) {
        this.message = message;
        this.success = false;
    }

    public AuthResponse(String token, String userId, String username, String role, String message) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.message = message;
        this.success = true;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}