package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentActivityResponse {
    private String id;
    private String type;
    private String title;
    private String description;
    private String timestamp;
    private Integer xpGained;
    private Integer score;
    private String status;
}