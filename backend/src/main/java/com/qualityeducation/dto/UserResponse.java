package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String languageToLearn;
    private String languageKnown;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    private String profileImage;
    private String bio;
    private Integer currentLevel;
    private Integer totalXP;
    private Integer currentStreak;
    private UserStatus status;
    
    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }
    
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return username;
    }
}