package com.qualityeducation.dto;

import lombok.Data;
import lombok.Builder;
import com.qualityeducation.model.Module;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ModuleWithLessonsResponse {

    private String id;
    private String title;
    private String description;
    private String duration;
    private Integer order;
    private String courseId;
    private Module.ModuleStatus status;
    private Integer totalLessons;
    private Integer completedLessons;
    private Double completionPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;

    // This would contain lesson details if needed
    private List<LessonSummaryResponse> lessons;
}