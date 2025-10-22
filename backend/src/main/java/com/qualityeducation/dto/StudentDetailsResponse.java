package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudentDetailsResponse {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private LocalDateTime enrolledDate;
    private StudentStats stats;
    private List<CourseProgress> courses;
    
    @Data
    @Builder
    public static class StudentStats {
        private int totalCourses;
        private int completedCourses;
        private int activeCourses;
        private double averageProgress;
        private double averageScore;
        private int totalLessonsCompleted;
        private int currentStreak;
    }
    
    @Data
    @Builder
    public static class CourseProgress {
        private String id;
        private String title;
        private String category;
        private int progress;
        private String grade;
        private String status;
        private int completedLessons;
        private int totalLessons;
        private LocalDateTime enrolledDate;
        private LocalDateTime lastActivity;
        private List<LessonProgress> lessons;
        private QuizStats quizStats;
    }
    
    @Data
    @Builder
    public static class LessonProgress {
        private String id;
        private String title;
        private boolean completed;
        private int progress;
        private LocalDateTime completedAt;
        private int quizScore;
        private int timeSpent; // in minutes
    }
    
    @Data
    @Builder
    public static class QuizStats {
        private int totalQuizzes;
        private int completedQuizzes;
        private double averageScore;
        private int bestScore;
        private int totalAttempts;
    }
}