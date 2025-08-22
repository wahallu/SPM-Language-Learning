package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentProfileResponse {
    private String id;
    private String username;
    private String email;
    private String languageToLearn;
    private String languageKnown;
    private String role;
    private LocalDateTime createdAt;
}