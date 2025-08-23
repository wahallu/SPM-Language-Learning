package com.qualityeducation.model;

import lombok.Data;
import lombok.Builder;
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
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teachers")
public class Teacher implements UserDetails {
    
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    private String phone;
    private String institution;
    private String department;
    private String qualifications;
    private String experience;
    private List<String> specialization;
    
    @Builder.Default
    private TeacherStatus status = TeacherStatus.PENDING;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    private String profileImage;
    private String bio;
    
    @Builder.Default
    private Double rating = 0.0;
    
    @Builder.Default
    private Integer totalStudents = 0;
    
    @Builder.Default
    private Integer totalCourses = 0;
    
    @Builder.Default
    private Integer totalReviews = 0;
    
    @Builder.Default
    private boolean enabled = true;
    
    @Builder.Default
    private boolean accountNonExpired = true;
    
    @Builder.Default
    private boolean accountNonLocked = true;
    
    @Builder.Default
    private boolean credentialsNonExpired = true;
    
    private String resetPasswordToken;
    private LocalDateTime resetPasswordExpiry;
    
    public enum TeacherStatus {
        PENDING,
        APPROVED,
        REJECTED,
        SUSPENDED,
        ACTIVE
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_TEACHER"));
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled && (status == TeacherStatus.APPROVED || status == TeacherStatus.ACTIVE);
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public void updateRating(Double newRating, Integer reviewCount) {
        if (this.totalReviews == 0) {
            this.rating = newRating;
        } else {
            this.rating = ((this.rating * this.totalReviews) + newRating) / (this.totalReviews + 1);
        }
        this.totalReviews = reviewCount;
    }
}