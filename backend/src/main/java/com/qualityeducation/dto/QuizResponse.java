package com.qualityeducation.dto;

import com.qualityeducation.model.Lesson;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizResponse {
    private String id;
    private String question;
    private List<String> options;
    private Integer correctAnswer;
    private String explanation;
    private Integer points;
    private Lesson.Quiz.QuizType type;

    public static QuizResponse fromQuiz(Lesson.Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .question(quiz.getQuestion())
                .options(quiz.getOptions())
                .correctAnswer(quiz.getCorrectAnswer())
                .explanation(quiz.getExplanation())
                .points(quiz.getPoints())
                .type(quiz.getType())
                .build();
    }
}