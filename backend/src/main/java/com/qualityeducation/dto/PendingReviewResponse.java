package com.qualityeducation.dto;

import lombok.Data;

@Data
public class PendingReviewResponse {
    private String id;
    private String title;
    private String teacher;
    private String language;
    private String level;
    private String submittedDate;
    private String priority;
}