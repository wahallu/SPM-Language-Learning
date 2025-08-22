package com.qualityeducation.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

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

    // Reference to the course this module belongs to
    private String courseId;

    // Reference to the teacher who created this module
    private String teacherId;

    @Builder.Default
    private ModuleStatus status = ModuleStatus.DRAFT;

    @Builder.Default
    private List<String> lessonIds = new ArrayList<>(); // References to lessons in this module

    @Builder.Default
    private Integer totalLessons = 0;

    @Builder.Default
    private Integer completedLessons = 0;

    @Builder.Default
    private Integer totalDurationMinutes = 0; // Total duration in minutes

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Additional metadata
    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;

    public enum ModuleStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED,
        UNDER_REVIEW
    }

    // Helper methods
    public void addLesson(String lessonId) {
        if (this.lessonIds == null) {
            this.lessonIds = new ArrayList<>();
        }
        this.lessonIds.add(lessonId);
        this.totalLessons = this.lessonIds.size();
        this.updatedAt = LocalDateTime.now();
    }

    public void removeLesson(String lessonId) {
        if (this.lessonIds != null) {
            this.lessonIds.remove(lessonId);
            this.totalLessons = this.lessonIds.size();
            this.updatedAt = LocalDateTime.now();
        }
    }

    public double getCompletionPercentage() {
        if (totalLessons == 0) return 0.0;
        return (double) completedLessons / totalLessons * 100.0;
    }

    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}