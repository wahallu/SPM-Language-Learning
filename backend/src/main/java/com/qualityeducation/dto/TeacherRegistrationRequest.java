package com.qualityeducation.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class TeacherRegistrationRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    @NotBlank(message = "Institution is required")
    private String institution;
    
    private String department;
    
    @NotBlank(message = "Qualifications are required")
    private String qualifications;
    
    @NotBlank(message = "Experience details are required")
    private String experience;
    
    @NotEmpty(message = "Please select at least one specialization")
    private List<String> specialization;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
}