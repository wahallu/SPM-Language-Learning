package com.qualityeducation.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "lessons")
public class Lesson {

    @Id
    private String id;

    private String title;
    private String description;
    private String videoUrl;
    private String duration;
    private Integer order;

    @Indexed
    private String moduleId;

    @Indexed
    private String courseId;

    @Indexed
    private String teacherId;

    @Builder.Default
    private LessonStatus status = LessonStatus.DRAFT;

    private List<Quiz> quizzes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    private String coverImage;
    private String transcript;
    private List<String> tags;
    private String difficulty;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    @Builder.Default
    private Boolean isActive = true;

    // Additional metadata
    private String videoThumbnail;
    private Long videoDurationSeconds;
    private String language;

    public enum LessonStatus {
        DRAFT,
        PUBLISHED,
        UNDER_REVIEW,
        ARCHIVED,
        REJECTED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Quiz {
        private String id;
        private String question;
        private List<String> options;
        private Integer correctAnswer;
        private String explanation;
        private Integer points;

        @Builder.Default
        private QuizType type = QuizType.MULTIPLE_CHOICE;

        public enum QuizType {
            MULTIPLE_CHOICE,
            TRUE_FALSE,
            FILL_IN_BLANK,
            SHORT_ANSWER
        }
    }

    // Helper methods
    public void incrementViews() {
        this.views = (this.views == null ? 0 : this.views) + 1;
    }

    public void updateRating(Double newRating) {
        if (this.totalRatings == null || this.totalRatings == 0) {
            this.averageRating = newRating;
            this.totalRatings = 1;
        } else {
            double totalScore = this.averageRating * this.totalRatings;
            this.totalRatings += 1;
            this.averageRating = (totalScore + newRating) / this.totalRatings;
        }
    }

    public String getFormattedDuration() {
        if (duration == null) return "Unknown";
        return duration;
    }

    public Integer getTotalQuizzes() {
        return quizzes != null ? quizzes.size() : 0;
    }
}