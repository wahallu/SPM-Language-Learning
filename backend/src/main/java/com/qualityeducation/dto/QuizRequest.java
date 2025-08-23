package com.qualityeducation.dto;

import com.qualityeducation.model.Lesson;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {
    @NotBlank(message = "Question is required")
    private String question;

    @NotNull(message = "Options are required")
    @Size(min = 2, max = 6, message = "Must have between 2 and 6 options")
    private List<String> options;

    @NotNull(message = "Correct answer is required")
    @Min(value = 0, message = "Correct answer must be a valid option index")
    private Integer correctAnswer;

    private String explanation;

    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;

    private Lesson.Quiz.QuizType type;
}