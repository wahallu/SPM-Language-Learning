package com.qualityeducation.dto;

import lombok.Data;
import com.qualityeducation.model.Module;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

@Data
public class ModuleUpdateRequest {

    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String duration;

    @Min(value = 1, message = "Order must be at least 1")
    private Integer order;

    private String coverImage;
    private List<String> learningObjectives;
    private List<String> prerequisites;
    private Module.ModuleStatus status;
}