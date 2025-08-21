package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TeacherResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String institution;
    private String department;
    private String qualifications;
    private String experience;
    private List<String> specialization;
    private TeacherStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImage;
    private String bio;
    private Double rating;
    private Integer totalStudents;
    private Integer totalCourses;
    
    public enum TeacherStatus {
        PENDING,
        APPROVED,
        REJECTED,
        SUSPENDED,
        ACTIVE
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}