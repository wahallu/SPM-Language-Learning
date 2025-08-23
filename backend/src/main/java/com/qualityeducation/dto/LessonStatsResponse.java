package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LessonStatsResponse {
    private Long totalLessons;
    private Long publishedLessons;
    private Long draftLessons;
    private Long totalViews;
    private Double averageRating;
    private Long totalQuizzes;
    private String mostPopularLesson;
    private String recentlyCreated;
}