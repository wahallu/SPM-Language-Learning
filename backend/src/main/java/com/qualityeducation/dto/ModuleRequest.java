package com.qualityeducation.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

@Data
public class ModuleRequest {

    @NotBlank(message = "Module title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Module description is required")
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotNull(message = "Order is required")
    @Min(value = 1, message = "Order must be at least 1")
    private Integer order;

    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;

}
