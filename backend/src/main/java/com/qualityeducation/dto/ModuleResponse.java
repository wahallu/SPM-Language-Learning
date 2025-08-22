package com.qualityeducation.dto;

import lombok.Data;
import lombok.Builder;
import com.qualityeducation.model.Module;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ModuleResponse {

    private String id;
    private String title;
    private String description;
    private String duration;
    private Integer order;
    private String courseId;
    private String teacherId;
    private Module.ModuleStatus status;
    private Integer totalLessons;
    private Integer completedLessons;
    private Integer totalDurationMinutes;
    private Double completionPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;
    private List<String> lessonIds;

    // Factory method to create response from entity
    public static ModuleResponse fromModule(Module module) {
        return ModuleResponse.builder()
                .id(module.getId())
                .title(module.getTitle())
                .description(module.getDescription())
                .duration(module.getDuration())
                .order(module.getOrder())
                .courseId(module.getCourseId())
                .teacherId(module.getTeacherId())
                .status(module.getStatus())
                .totalLessons(module.getTotalLessons())
                .completedLessons(module.getCompletedLessons())
                .totalDurationMinutes(module.getTotalDurationMinutes())
                .completionPercentage(module.getCompletionPercentage())
                .createdAt(module.getCreatedAt())
                .updatedAt(module.getUpdatedAt())
                .coverImage(module.getCoverImage())
                .learningObjectives(module.getLearningObjectives())
                .prerequisites(module.getPrerequisites())
                .build();
    }
}