package com.qualityeducation.dto;

import com.qualityeducation.model.Lesson;
import lombok.Data;

import java.util.List;

@Data
public class LessonUpdateRequest {
    private String title;
    private String description;
    private String videoUrl;
    private String duration;
    private Integer order;
    private Lesson.LessonStatus status;
    private String coverImage;
    private String transcript;
    private List<String> tags;
    private String difficulty;
    private String language;
    private List<QuizRequest> quizzes;
}