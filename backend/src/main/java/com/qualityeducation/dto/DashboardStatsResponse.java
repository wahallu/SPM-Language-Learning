package com.qualityeducation.dto;

import lombok.Data;

@Data
public class DashboardStatsResponse {
    private int totalLessons;
    private int pendingReviews;
    private int totalTeachers;
    private int totalStudents;
    private int approvedToday;
    private int rejectedToday;
    private double averageRating;
    private double completionRate;
}