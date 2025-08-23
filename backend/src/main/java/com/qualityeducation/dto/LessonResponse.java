package com.qualityeducation.dto;
import lombok.Builder;
import lombok.Data;

import com.qualityeducation.model.Lesson;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class LessonResponse {
    private String id;
    private String title;
    private String description;
    private String videoUrl;
    private String duration;
    private Integer order;
    private String moduleId;
    private String courseId;
    private String teacherId;
    private Lesson.LessonStatus status;
    private List<QuizResponse> quizzes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String coverImage;
    private String transcript;
    private List<String> tags;
    private String difficulty;
    private Integer views;
    private Double averageRating;
    private Integer totalRatings;
    private String videoThumbnail;
    private Long videoDurationSeconds;
    private String language;

    public static LessonResponse fromLesson(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .duration(lesson.getDuration())
                .order(lesson.getOrder())
                .moduleId(lesson.getModuleId())
                .courseId(lesson.getCourseId())
                .teacherId(lesson.getTeacherId())
                .status(lesson.getStatus())
                .quizzes(lesson.getQuizzes() != null ?
                        lesson.getQuizzes().stream()
                                .map(QuizResponse::fromQuiz)
                                .toList() : null)
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .coverImage(lesson.getCoverImage())
                .transcript(lesson.getTranscript())
                .tags(lesson.getTags())
                .difficulty(lesson.getDifficulty())
                .views(lesson.getViews())
                .averageRating(lesson.getAverageRating())
                .totalRatings(lesson.getTotalRatings())
                .videoThumbnail(lesson.getVideoThumbnail())
                .videoDurationSeconds(lesson.getVideoDurationSeconds())
                .language(lesson.getLanguage())
                .build();
    }
}