package com.qualityeducation.dto;

import com.qualityeducation.model.Supervisor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SupervisorResponse {
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
    private Supervisor.SupervisorStatus status;
    private boolean isActive;
    private String employeeId;
    private Supervisor.SupervisorRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    public static SupervisorResponse fromSupervisor(Supervisor supervisor) {
        return SupervisorResponse.builder()
                .id(supervisor.getId())
                .firstName(supervisor.getFirstName())
                .lastName(supervisor.getLastName())
                .email(supervisor.getEmail())
                .phone(supervisor.getPhone())
                .institution(supervisor.getInstitution())
                .department(supervisor.getDepartment())
                .qualifications(supervisor.getQualifications())
                .experience(supervisor.getExperience())
                .specialization(supervisor.getSpecialization())
                .status(supervisor.getStatus())
                .isActive(supervisor.isActive())
                .employeeId(supervisor.getEmployeeId())
                .role(supervisor.getRole())
                .createdAt(supervisor.getCreatedAt())
                .updatedAt(supervisor.getUpdatedAt())
                .lastLoginAt(supervisor.getLastLoginAt())
                .build();
    }
}