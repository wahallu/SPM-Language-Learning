package com.qualityeducation.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class TeacherLoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private boolean rememberMe = false;
}