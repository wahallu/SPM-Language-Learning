package com.qualityeducation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "supervisors")
public class Supervisor {
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String email;
    
    private String phone;
    private String institution;
    private String department;
    private String qualifications;
    private String experience;
    private List<String> specialization;
    private String password;
    
    private SupervisorStatus status = SupervisorStatus.PENDING; // PENDING, APPROVED, REJECTED
    private boolean isActive = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime lastLoginAt;
    
    // Additional supervisor-specific fields
    private String employeeId;
    private String profileImage;
    private SupervisorRole role = SupervisorRole.SUPERVISOR; // SUPERVISOR, SENIOR_SUPERVISOR, ADMIN
    
    public enum SupervisorStatus {
        PENDING, APPROVED, REJECTED, SUSPENDED
    }
    
    public enum SupervisorRole {
        SUPERVISOR, SENIOR_SUPERVISOR, ADMIN
    }
}