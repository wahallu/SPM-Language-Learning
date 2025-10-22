package com.qualityeducation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "enrollments")
public class Enrollment {
    
    @Id
    private String id;
    
    @Indexed
    private String studentId;
    
    @Indexed
    private String courseId;
    
    @Indexed
    private String teacherId;
    
    @Builder.Default
    private LocalDateTime enrolledDate = LocalDateTime.now();
    
    @Builder.Default
    private int progress = 0; // 0-100
    
    @Builder.Default
    private String status = "active"; // active, completed, dropped, at-risk
    
    private String grade; // A+, A, B+, B, C+, C, etc.
    
    @Builder.Default
    private int completedLessons = 0;
    
    @Builder.Default
    private int totalLessons = 0;
    
    private LocalDateTime lastActivity;
    
    private LocalDateTime completedDate;
    
    @Builder.Default
    private List<LessonProgress> lessonProgress = new ArrayList<>();
    
    @Builder.Default
    private QuizStats quizStats = new QuizStats();
    
    @Builder.Default
    private int currentStreak = 0;
    
    @Builder.Default
    private int totalTimeSpent = 0; // in minutes
    
    private String certificateId;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonProgress {
        private String lessonId;
        private boolean completed;
        private int progress; // 0-100
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private int quizScore;
        private int attempts;
        private int timeSpent; // in minutes
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizStats {
        @Builder.Default
        private int totalQuizzes = 0;
        @Builder.Default
        private int completedQuizzes = 0;
        @Builder.Default
        private double averageScore = 0.0;
        @Builder.Default
        private int bestScore = 0;
        @Builder.Default
        private int totalAttempts = 0;
    }
    
    public void updateProgress() {
        if (totalLessons > 0) {
            this.progress = (completedLessons * 100) / totalLessons;
            
            if (progress == 100) {
                this.status = "completed";
                this.completedDate = LocalDateTime.now();
            } else if (progress > 0) {
                this.status = "active";
            }
        }
        
        // Calculate grade based on average quiz score
        if (quizStats != null && quizStats.getAverageScore() > 0) {
            this.grade = calculateGrade(quizStats.getAverageScore());
        }
    }
    
    private String calculateGrade(double score) {
        if (score >= 95) return "A+";
        if (score >= 90) return "A";
        if (score >= 85) return "B+";
        if (score >= 80) return "B";
        if (score >= 75) return "C+";
        if (score >= 70) return "C";
        if (score >= 65) return "D+";
        if (score >= 60) return "D";
        return "F";
    }
}