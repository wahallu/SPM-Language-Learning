package com.qualityeducation.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {
    
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String languageToLearn;
    private String languageKnown;
    private String resetToken;
    private Long resetTokenExpiry;
    
    @Builder.Default
    private String role = "STUDENT";
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    // Profile fields
    private String profileImage;
    private String bio;
    private Integer currentLevel;
    private Integer totalXP;
    private Integer currentStreak;
    
    @Builder.Default
    private boolean enabled = true;
    
    @Builder.Default
    private boolean accountNonExpired = true;
    
    @Builder.Default
    private boolean accountNonLocked = true;
    
    @Builder.Default
    private boolean credentialsNonExpired = true;
    
    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }
    
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled && status == UserStatus.ACTIVE;
    }
    
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return username;
    }
}