package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.service.LessonService;
import com.qualityeducation.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" },
        allowedHeaders = "*",
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS },
        allowCredentials = "true")
public class LessonController {

    private final LessonService lessonService;
    private final JwtService jwtService;

    // Public endpoint to get all published lessons (no authentication required)
    @GetMapping("/public/all")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getAllPublishedLessons() {
        try {
            log.info("Fetching all published lessons (public access)");
            ApiResponse<List<LessonResponse>> response = lessonService.getAllPublishedLessons();

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error fetching published lessons", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve published lessons", e.getMessage()));
        }
    }

    // Public endpoint to get a single published lesson by ID (no authentication required)
    @GetMapping("/public/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> getPublishedLessonById(
            @PathVariable String lessonId) {
        try {
            log.info("Fetching published lesson: {} (public access)", lessonId);
            ApiResponse<LessonResponse> response = lessonService.getPublishedLessonById(lessonId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error fetching published lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve lesson", e.getMessage()));
        }
    }

    @PostMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @PathVariable String moduleId,
            @Valid @RequestBody LessonRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Creating lesson in module: {} by teacher: {}", moduleId, teacherId);

            ApiResponse<LessonResponse> response = lessonService.createLesson(moduleId, request, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error creating lesson in module: {}", moduleId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create lesson", e.getMessage()));
        }
    }

    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByModule(
            @PathVariable String moduleId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Fetching lessons for module: {} by teacher: {}", moduleId, teacherId);

            ApiResponse<List<LessonResponse>> response = lessonService.getLessonsByModule(moduleId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error fetching lessons for module: {}", moduleId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve lessons", e.getMessage()));
        }
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable String lessonId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Fetching lesson: {} by teacher: {}", lessonId, teacherId);

            ApiResponse<LessonResponse> response = lessonService.getLessonById(lessonId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error fetching lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve lesson", e.getMessage()));
        }
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable String lessonId,
            @Valid @RequestBody LessonUpdateRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Updating lesson: {} by teacher: {}", lessonId, teacherId);

            ApiResponse<LessonResponse> response = lessonService.updateLesson(lessonId, request, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error updating lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update lesson", e.getMessage()));
        }
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<String>> deleteLesson(
            @PathVariable String lessonId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Deleting lesson: {} by teacher: {}", lessonId, teacherId);

            ApiResponse<String> response = lessonService.deleteLesson(lessonId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error deleting lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete lesson", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> searchLessons(
            @RequestParam String courseId,
            @RequestParam String searchTerm,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Searching lessons in course: {} with term: {} by teacher: {}", courseId, searchTerm, teacherId);

            ApiResponse<List<LessonResponse>> response = lessonService.searchLessons(courseId, searchTerm, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error searching lessons in course: {} with term: {}", courseId, searchTerm, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search lessons", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<LessonStatsResponse>> getLessonStats(
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Fetching lesson statistics for teacher: {}", teacherId);

            ApiResponse<LessonStatsResponse> response = lessonService.getLessonStats(teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error fetching lesson statistics for teacher", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve statistics", e.getMessage()));
        }
    }

    @PutMapping("/modules/{moduleId}/reorder")
    public ResponseEntity<ApiResponse<String>> reorderLessons(
            @PathVariable String moduleId,
            @RequestBody Map<String, List<String>> requestBody,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            List<String> lessonIds = requestBody.get("lessonIds");

            if (lessonIds == null || lessonIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Lesson IDs are required for reordering"));
            }

            log.info("Reordering lessons in module: {} by teacher: {}", moduleId, teacherId);

            ApiResponse<String> response = lessonService.reorderLessons(moduleId, lessonIds, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error reordering lessons in module: {}", moduleId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to reorder lessons", e.getMessage()));
        }
    }

    @PutMapping("/{lessonId}/publish")
    public ResponseEntity<ApiResponse<String>> publishLesson(
            @PathVariable String lessonId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Publishing lesson: {} by teacher: {}", lessonId, teacherId);

            ApiResponse<String> response = lessonService.publishLesson(lessonId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error publishing lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to publish lesson", e.getMessage()));
        }
    }

    @PutMapping("/{lessonId}/unpublish")
    public ResponseEntity<ApiResponse<String>> unpublishLesson(
            @PathVariable String lessonId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            log.info("Unpublishing lesson: {} by teacher: {}", lessonId, teacherId);

            ApiResponse<String> response = lessonService.unpublishLesson(lessonId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error unpublishing lesson: {}", lessonId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to unpublish lesson", e.getMessage()));
        }
    }

    // Helper method to extract teacher ID from JWT token
    private String extractTeacherIdFromToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                throw new RuntimeException("Authorization token is required");
            }

            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Use existing JwtService to extract teacher ID
            return jwtService.extractTeacherId(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token: " + e.getMessage());
        }
    }
}