package com.qualityeducation.dto;

import com.qualityeducation.model.Supervisor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
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
    private LocalDateTime lastLoginAt;
    
    public static SupervisorResponse fromSupervisor(Supervisor supervisor) {
        SupervisorResponse response = new SupervisorResponse();
        response.setId(supervisor.getId());
        response.setFirstName(supervisor.getFirstName());
        response.setLastName(supervisor.getLastName());
        response.setEmail(supervisor.getEmail());
        response.setPhone(supervisor.getPhone());
        response.setInstitution(supervisor.getInstitution());
        response.setDepartment(supervisor.getDepartment());
        response.setQualifications(supervisor.getQualifications());
        response.setExperience(supervisor.getExperience());
        response.setSpecialization(supervisor.getSpecialization());
        response.setStatus(supervisor.getStatus());
        response.setActive(supervisor.isActive());
        response.setEmployeeId(supervisor.getEmployeeId());
        response.setRole(supervisor.getRole());
        response.setCreatedAt(supervisor.getCreatedAt());
        response.setLastLoginAt(supervisor.getLastLoginAt());
        return response;
    }
}
