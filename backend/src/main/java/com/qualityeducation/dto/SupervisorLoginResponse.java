package com.qualityeducation.dto;

import lombok.Data;

@Data
public class SupervisorLoginResponse {
    private SupervisorResponse supervisor;
    private String token;
    private long expiresIn; // seconds
}
