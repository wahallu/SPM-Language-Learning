package com.qualityeducation.dto;

import lombok.Data;

@Data
public class ActivityResponse {
    private String id;
    private String type;
    private String title;
    private String teacher;
    private String time;
    private String status;
}