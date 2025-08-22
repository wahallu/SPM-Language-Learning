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
@Document(collection = "modules")
public class Module {

    @Id
    private String id;

    private String title;
    private String description;
    private String duration;
    private Integer order;

    @Indexed
    private String courseId;

    @Indexed
    private String teacherId;

    @Builder.Default
    private ModuleStatus status = ModuleStatus.DRAFT;

    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;

    @Builder.Default
    private Integer totalLessons = 0;

    @Builder.Default
    private Integer completedLessons = 0;

    @Builder.Default
    private Double completionPercentage = 0.0;

    @Builder.Default
    private Integer totalDurationMinutes = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Additional metadata
    private String difficulty;
    private List<String> tags;
    private String language;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalRatings = 0;

    public enum ModuleStatus {
        DRAFT,
        PUBLISHED,
        UNDER_REVIEW,
        ARCHIVED,
        REJECTED
    }

    // Helper methods
    public void updateCompletionPercentage() {
        if (totalLessons != null && totalLessons > 0 && completedLessons != null) {
            this.completionPercentage = (double) completedLessons / totalLessons * 100.0;
        } else {
            this.completionPercentage = 0.0;
        }
    }

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

    public boolean hasLessons() {
        return totalLessons != null && totalLessons > 0;
    }
}