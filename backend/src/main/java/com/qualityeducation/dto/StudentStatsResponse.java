package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentStatsResponse {
    private int coursesEnrolled;
    private int coursesCompleted;
    private int totalXP;
    private int currentLevel;
    private int currentStreak;
    private int totalLessons;
    private int completedLessons;
    private int averageScore;
    private String timeSpent;
    private int achievementsUnlocked;
}