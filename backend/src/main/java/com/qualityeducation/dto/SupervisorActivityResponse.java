package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SupervisorActivityResponse {
    private String id;
    private String type;
    private String title;
    private String description;
    private LocalDateTime timestamp;
    private String status;
}
