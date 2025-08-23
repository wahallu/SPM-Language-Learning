package com.qualityeducation.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LessonSummaryResponse {
    private String id;
    private String title;
    private String description;
    private String duration;
    private Integer order;
    private String status;
    private String videoUrl;
    private Integer quizCount;
}