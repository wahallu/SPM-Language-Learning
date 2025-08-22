package com.qualityeducation.dto;

import jakarta.validation.Valid;
import lombok.Data;
import jakarta.validation.constraints.*;

import java.util.List;

// Request DTOs
@Data
public class LessonRequest {
    @NotBlank(message = "Lesson title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Video URL is required")
    @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.be)/.+", message = "Please provide a valid YouTube URL")
    private String videoUrl;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Order is required")
    @Min(value = 1, message = "Order must be at least 1")
    private Integer order;

    private String coverImage;
    private String transcript;
    private List<String> tags;
    private String difficulty;
    private String language;

    @Valid
    private List<QuizRequest> quizzes;
}