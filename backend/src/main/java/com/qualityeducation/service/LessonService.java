package com.qualityeducation.service;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.Lesson;
import com.qualityeducation.model.Module;
import com.qualityeducation.model.Course;
import com.qualityeducation.repository.LessonRepository;
import com.qualityeducation.repository.ModuleRepository;
import com.qualityeducation.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public ApiResponse<LessonResponse> createLesson(String moduleId, LessonRequest request) {
        try {
            log.info("Creating lesson for module: {}", moduleId);

            // Validate module exists
            if (!moduleService.moduleExists(moduleId)) {
                return ApiResponse.error("Module not found");
            }

            // Build lesson with proper quiz mapping
            Lesson lesson = Lesson.builder()
                    .title(request.getTitle().trim())
                    .description(request.getDescription().trim())
                    .videoUrl(request.getVideoUrl().trim())
                    .duration(request.getDuration().trim())
                    .order(request.getOrder())
                    .moduleId(moduleId)
                    .status(Lesson.LessonStatus.DRAFT)
                    .coverImage(request.getCoverImage())
                    .transcript(request.getTranscript())
                    .tags(request.getTags())
                    .difficulty(request.getDifficulty())
                    .language(request.getLanguage())
                    .quizzes(mapQuizRequests(request.getQuizzes())) // Fix quiz mapping
                    .views(0)
                    .averageRating(0.0)
                    .totalRatings(0)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            Lesson savedLesson = lessonRepository.save(lesson);
            log.info("Lesson created successfully with ID: {}", savedLesson.getId());

            // Update module lesson count
            moduleService.incrementLessonCount(moduleId);

            return ApiResponse.success(LessonResponse.fromLesson(savedLesson));

        } catch (Exception e) {
            log.error("Error creating lesson: ", e);
            return ApiResponse.error("Failed to create lesson: " + e.getMessage());
        }
    }

    public ApiResponse<List<LessonResponse>> getLessonsByModule(String moduleId, String teacherId) {
        try {
            log.info("Fetching lessons for module: {}", moduleId);

            // Verify module exists and belongs to teacher
            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            Optional<Course> courseOpt = courseRepository.findById(module.getCourseId());
            if (courseOpt.isEmpty() || !courseOpt.get().getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to view lessons in this module");
            }

            List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderAsc(moduleId);
            List<LessonResponse> responses = lessons.stream()
                    .map(LessonResponse::fromLesson)
                    .collect(Collectors.toList());

            return ApiResponse.success("Lessons retrieved successfully", responses);

        } catch (Exception e) {
            log.error("Failed to fetch lessons for module: {}", moduleId, e);
            return ApiResponse.error("Failed to retrieve lessons: " + e.getMessage());
        }
    }

    public ApiResponse<LessonResponse> getLessonById(String lessonId, String teacherId) {
        try {
            log.info("Fetching lesson: {} for teacher: {}", lessonId, teacherId);

            Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
            if (lessonOpt.isEmpty()) {
                return ApiResponse.error("Lesson not found");
            }

            Lesson lesson = lessonOpt.get();

            // Verify lesson belongs to teacher
            if (!lesson.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to view this lesson");
            }

            LessonResponse response = LessonResponse.fromLesson(lesson);
            return ApiResponse.success("Lesson retrieved successfully", response);

        } catch (Exception e) {
            log.error("Failed to fetch lesson: {}", lessonId, e);
            return ApiResponse.error("Failed to retrieve lesson: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<LessonResponse> updateLesson(String lessonId, LessonUpdateRequest request) {
        try {
            log.info("Updating lesson: {}", lessonId);

            Optional<Lesson> optionalLesson = lessonRepository.findById(lessonId);
            if (optionalLesson.isEmpty()) {
                return ApiResponse.error("Lesson not found");
            }

            Lesson lesson = optionalLesson.get();

            // Update lesson fields
            if (request.getTitle() != null) {
                lesson.setTitle(request.getTitle().trim());
            }
            if (request.getDescription() != null) {
                lesson.setDescription(request.getDescription().trim());
            }
            if (request.getVideoUrl() != null) {
                lesson.setVideoUrl(request.getVideoUrl().trim());
            }
            if (request.getDuration() != null) {
                lesson.setDuration(request.getDuration().trim());
            }
            if (request.getOrder() != null) {
                lesson.setOrder(request.getOrder());
            }
            if (request.getStatus() != null) {
                lesson.setStatus(request.getStatus());
            }
            if (request.getCoverImage() != null) {
                lesson.setCoverImage(request.getCoverImage());
            }
            if (request.getTranscript() != null) {
                lesson.setTranscript(request.getTranscript());
            }
            if (request.getTags() != null) {
                lesson.setTags(request.getTags());
            }
            if (request.getDifficulty() != null) {
                lesson.setDifficulty(request.getDifficulty());
            }
            if (request.getLanguage() != null) {
                lesson.setLanguage(request.getLanguage());
            }
            
            // Update quizzes - this is crucial
            if (request.getQuizzes() != null) {
                lesson.setQuizzes(mapQuizRequests(request.getQuizzes()));
                log.info("Updated {} quizzes for lesson {}", request.getQuizzes().size(), lessonId);
            }

            lesson.setUpdatedAt(LocalDateTime.now());

            Lesson updatedLesson = lessonRepository.save(lesson);
            log.info("Lesson updated successfully: {}", lessonId);

            return ApiResponse.success(LessonResponse.fromLesson(updatedLesson));

        } catch (Exception e) {
            log.error("Error updating lesson: ", e);
            return ApiResponse.error("Failed to update lesson: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> deleteLesson(String lessonId, String teacherId) {
        try {
            log.info("Deleting lesson: {} by teacher: {}", lessonId, teacherId);

            Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
            if (lessonOpt.isEmpty()) {
                return ApiResponse.error("Lesson not found");
            }

            Lesson lesson = lessonOpt.get();

            // Verify lesson belongs to teacher
            if (!lesson.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to delete this lesson");
            }

            String moduleId = lesson.getModuleId();
            lessonRepository.deleteById(lessonId);

            // Update module lesson count
            updateModuleLessonCount(moduleId);

            log.info("Lesson deleted successfully: {}", lessonId);
            return ApiResponse.success("Lesson deleted successfully");

        } catch (Exception e) {
            log.error("Failed to delete lesson: {}", lessonId, e);
            return ApiResponse.error("Failed to delete lesson: " + e.getMessage());
        }
    }

    public ApiResponse<List<LessonResponse>> searchLessons(String courseId, String searchTerm, String teacherId) {
        try {
            log.info("Searching lessons in course: {} with term: {}", courseId, searchTerm);

            // Verify course belongs to teacher
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty() || !courseOpt.get().getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to search lessons in this course");
            }

            List<Lesson> lessons = lessonRepository.findByCourseIdAndTitleOrDescriptionContainingIgnoreCase(courseId, searchTerm);
            List<LessonResponse> responses = lessons.stream()
                    .map(LessonResponse::fromLesson)
                    .collect(Collectors.toList());

            return ApiResponse.success("Search completed successfully", responses);

        } catch (Exception e) {
            log.error("Failed to search lessons in course: {}", courseId, e);
            return ApiResponse.error("Failed to search lessons: " + e.getMessage());
        }
    }

    public ApiResponse<LessonStatsResponse> getLessonStats(String teacherId) {
        try {
            log.info("Fetching lesson statistics for teacher: {}", teacherId);

            List<Lesson> allLessons = lessonRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);

            long totalLessons = allLessons.size();
            long publishedLessons = allLessons.stream()
                    .filter(lesson -> lesson.getStatus() == Lesson.LessonStatus.PUBLISHED)
                    .count();
            long draftLessons = allLessons.stream()
                    .filter(lesson -> lesson.getStatus() == Lesson.LessonStatus.DRAFT)
                    .count();

            long totalViews = allLessons.stream()
                    .mapToLong(lesson -> lesson.getViews() != null ? lesson.getViews() : 0)
                    .sum();

            double averageRating = allLessons.stream()
                    .filter(lesson -> lesson.getAverageRating() != null && lesson.getAverageRating() > 0)
                    .mapToDouble(Lesson::getAverageRating)
                    .average()
                    .orElse(0.0);

            long totalQuizzes = allLessons.stream()
                    .mapToLong(lesson -> lesson.getQuizzes() != null ? lesson.getQuizzes().size() : 0)
                    .sum();

            String mostPopularLesson = allLessons.stream()
                    .filter(lesson -> lesson.getViews() != null && lesson.getViews() > 0)
                    .max((l1, l2) -> Integer.compare(l1.getViews(), l2.getViews()))
                    .map(Lesson::getTitle)
                    .orElse("None");

            String recentlyCreated = allLessons.isEmpty() ? "None" : allLessons.get(0).getTitle();

            LessonStatsResponse stats = LessonStatsResponse.builder()
                    .totalLessons(totalLessons)
                    .publishedLessons(publishedLessons)
                    .draftLessons(draftLessons)
                    .totalViews(totalViews)
                    .averageRating(Math.round(averageRating * 100.0) / 100.0)
                    .totalQuizzes(totalQuizzes)
                    .mostPopularLesson(mostPopularLesson)
                    .recentlyCreated(recentlyCreated)
                    .build();

            return ApiResponse.success("Statistics retrieved successfully", stats);

        } catch (Exception e) {
            log.error("Failed to fetch lesson statistics for teacher: {}", teacherId, e);
            return ApiResponse.error("Failed to retrieve statistics: " + e.getMessage());
        }
    }

    // Helper methods
    private Lesson.Quiz mapToQuiz(QuizRequest request) {
        return Lesson.Quiz.builder()
                .id(UUID.randomUUID().toString())
                .question(request.getQuestion().trim())
                .options(request.getOptions().stream()
                        .map(String::trim)
                        .collect(Collectors.toList()))
                .correctAnswer(request.getCorrectAnswer())
                .explanation(request.getExplanation())
                .points(request.getPoints() != null ? request.getPoints() : 1)
                .type(request.getType() != null ? request.getType() : Lesson.Quiz.QuizType.MULTIPLE_CHOICE)
                .build();
    }

    private String extractYouTubeThumbnail(String videoUrl) {
        try {
            // Extract video ID from YouTube URL
            String videoId = null;
            if (videoUrl.contains("youtube.com/watch?v=")) {
                videoId = videoUrl.split("v=")[1];
                int ampersandPosition = videoId.indexOf('&');
                if (ampersandPosition != -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }
            } else if (videoUrl.contains("youtu.be/")) {
                videoId = videoUrl.split("youtu.be/")[1];
                int questionMarkPosition = videoId.indexOf('?');
                if (questionMarkPosition != -1) {
                    videoId = videoId.substring(0, questionMarkPosition);
                }
            }

            if (videoId != null && !videoId.isEmpty()) {
                return "https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
            }
        } catch (Exception e) {
            log.warn("Failed to extract YouTube thumbnail from URL: {}", videoUrl, e);
        }
        return null;
    }

    private void updateModuleLessonCount(String moduleId) {
        try {
            long lessonCount = lessonRepository.countByModuleId(moduleId);
            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isPresent()) {
                Module module = moduleOpt.get();
                module.setTotalLessons((int) lessonCount);
                module.setUpdatedAt(LocalDateTime.now());
                moduleRepository.save(module);
                log.debug("Updated module {} lesson count to {}", moduleId, lessonCount);
            }
        } catch (Exception e) {
            log.warn("Failed to update lesson count for module: {}", moduleId, e);
        }
    }

    @Transactional
    public ApiResponse<String> reorderLessons(String moduleId, List<String> lessonIds, String teacherId) {
        try {
            log.info("Reordering lessons in module: {}", moduleId);

            // Verify module belongs to teacher
            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isEmpty()) {
                return ApiResponse.error("Module not found");
            }

            Module module = moduleOpt.get();
            Optional<Course> courseOpt = courseRepository.findById(module.getCourseId());
            if (courseOpt.isEmpty() || !courseOpt.get().getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to reorder lessons in this module");
            }

            // Update lesson orders
            for (int i = 0; i < lessonIds.size(); i++) {
                String lessonId = lessonIds.get(i);
                Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
                if (lessonOpt.isPresent()) {
                    Lesson lesson = lessonOpt.get();
                    lesson.setOrder(i + 1);
                    lesson.setUpdatedAt(LocalDateTime.now());
                    lessonRepository.save(lesson);
                }
            }

            return ApiResponse.success("Lessons reordered successfully");

        } catch (Exception e) {
            log.error("Failed to reorder lessons in module: {}", moduleId, e);
            return ApiResponse.error("Failed to reorder lessons: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> publishLesson(String lessonId, String teacherId) {
        try {
            log.info("Publishing lesson: {}", lessonId);

            Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
            if (lessonOpt.isEmpty()) {
                return ApiResponse.error("Lesson not found");
            }

            Lesson lesson = lessonOpt.get();

            // Verify lesson belongs to teacher
            if (!lesson.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to publish this lesson");
            }

            lesson.setStatus(Lesson.LessonStatus.PUBLISHED);
            lesson.setUpdatedAt(LocalDateTime.now());
            lessonRepository.save(lesson);

            return ApiResponse.success("Lesson published successfully");

        } catch (Exception e) {
            log.error("Failed to publish lesson: {}", lessonId, e);
            return ApiResponse.error("Failed to publish lesson: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> unpublishLesson(String lessonId, String teacherId) {
        try {
            log.info("Unpublishing lesson: {}", lessonId);

            Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
            if (lessonOpt.isEmpty()) {
                return ApiResponse.error("Lesson not found");
            }

            Lesson lesson = lessonOpt.get();

            // Verify lesson belongs to teacher
            if (!lesson.getTeacherId().equals(teacherId)) {
                return ApiResponse.error("You don't have permission to unpublish this lesson");
            }

            lesson.setStatus(Lesson.LessonStatus.DRAFT);
            lesson.setUpdatedAt(LocalDateTime.now());
            lessonRepository.save(lesson);

            return ApiResponse.success("Lesson unpublished successfully");

        } catch (Exception e) {
            log.error("Failed to unpublish lesson: {}", lessonId, e);
            return ApiResponse.error("Failed to unpublish lesson: " + e.getMessage());
        }
    }

    // Helper method to map quiz requests
    private List<Lesson.Quiz> mapQuizRequests(List<QuizRequest> quizRequests) {
        if (quizRequests == null || quizRequests.isEmpty()) {
            return new ArrayList<>();
        }

        return quizRequests.stream()
                .filter(Objects::nonNull)
                .map(this::mapToQuiz)
                .collect(Collectors.toList());
    }

    // Enhanced quiz mapping with better validation
    private Lesson.Quiz mapToQuiz(QuizRequest request) {
        if (request == null) {
            return null;
        }

        return Lesson.Quiz.builder()
                .id(UUID.randomUUID().toString())
                .question(request.getQuestion() != null ? request.getQuestion().trim() : "")
                .options(request.getOptions() != null ? 
                    request.getOptions().stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(option -> !option.isEmpty())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .correctAnswer(request.getCorrectAnswer() != null ? request.getCorrectAnswer() : 0)
                .explanation(request.getExplanation() != null ? request.getExplanation().trim() : "")
                .points(request.getPoints() != null ? request.getPoints() : 1)
                .type(request.getType() != null ? request.getType() : Lesson.Quiz.QuizType.MULTIPLE_CHOICE)
                .build();
    }
}