package com.qualityeducation.dto;

import lombok.Data;

import java.util.List;

@Data
public class SupervisorUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String department;
    private String qualifications;
    private String experience;
    private List<String> specialization;
}