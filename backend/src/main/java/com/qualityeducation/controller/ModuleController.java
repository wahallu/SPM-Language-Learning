package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.model.Module;
import com.qualityeducation.service.ModuleService;
import com.qualityeducation.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" },
        allowedHeaders = "*",
        methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.OPTIONS },
        allowCredentials = "true")
public class ModuleController {

    private final ModuleService moduleService;
    private final JwtService jwtService;

    /**
     * Create a new module for a course
     */
    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<ModuleResponse>> createModule(
            @PathVariable String courseId,
            @Valid @RequestBody ModuleRequest request,
            @RequestHeader(value = "Authorization", required = false) String token,
            BindingResult bindingResult) {

        try {
            // Validate request
            if (bindingResult.hasErrors()) {
                String errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));

                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", errors));
            }

            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<ModuleResponse> response = moduleService.createModule(courseId, request, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error creating module for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create module", e.getMessage()));
        }
    }

    /**
     * Get all modules for a course
     */
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<ModuleResponse>>> getModulesByCourse(
            @PathVariable String courseId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<List<ModuleResponse>> response = moduleService.getModulesByCourse(courseId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error fetching modules for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve modules", e.getMessage()));
        }
    }

    /**
     * Get a specific module by ID
     */
    @GetMapping("/{moduleId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<ModuleResponse>> getModuleById(
            @PathVariable String moduleId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<ModuleResponse> response = moduleService.getModuleById(moduleId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error fetching module {}: {}", moduleId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve module", e.getMessage()));
        }
    }

    /**
     * Update a module
     */
    @PutMapping("/{moduleId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<ModuleResponse>> updateModule(
            @PathVariable String moduleId,
            @Valid @RequestBody ModuleUpdateRequest request,
            @RequestHeader(value = "Authorization", required = false) String token,
            BindingResult bindingResult) {

        try {
            // Validate request
            if (bindingResult.hasErrors()) {
                String errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));

                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", errors));
            }

            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<ModuleResponse> response = moduleService.updateModule(moduleId, request, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error updating module {}: {}", moduleId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update module", e.getMessage()));
        }
    }

    /**
     * Delete a module
     */
    @DeleteMapping("/{moduleId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<Void>> deleteModule(
            @PathVariable String moduleId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<Void> response = moduleService.deleteModule(moduleId, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error deleting module {}: {}", moduleId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete module", e.getMessage()));
        }
    }

    /**
     * Reorder modules in a course
     */
    @PutMapping("/course/{courseId}/reorder")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<ModuleResponse>>> reorderModules(
            @PathVariable String courseId,
            @Valid @RequestBody ModuleReorderRequest request,
            @RequestHeader(value = "Authorization", required = false) String token,
            BindingResult bindingResult) {

        try {
            // Validate request
            if (bindingResult.hasErrors()) {
                String errors = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.joining(", "));

                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", errors));
            }

            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<List<ModuleResponse>> response = moduleService.reorderModules(courseId, request, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error reordering modules for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to reorder modules", e.getMessage()));
        }
    }

    /**
     * Get all modules by teacher
     */
    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<ModuleResponse>>> getModulesByTeacher(
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<List<ModuleResponse>> response = moduleService.getModulesByTeacher(teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error fetching modules for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve modules", e.getMessage()));
        }
    }

    /**
     * Update module status
     */
    @PatchMapping("/{moduleId}/status")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<ModuleResponse>> updateModuleStatus(
            @PathVariable String moduleId,
            @RequestParam Module.ModuleStatus status,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            String teacherId = extractTeacherIdFromToken(token);
            ApiResponse<ModuleResponse> response = moduleService.updateModuleStatus(moduleId, status, teacherId);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error updating module status {}: {}", moduleId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update module status", e.getMessage()));
        }
    }

    /**
     * Get next available order for a course
     */
    @GetMapping("/course/{courseId}/next-order")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SUPERVISOR')")
    public ResponseEntity<ApiResponse<Integer>> getNextOrderForCourse(@PathVariable String courseId) {
        try {
            int nextOrder = moduleService.getNextOrderForCourse(courseId);
            return ResponseEntity.ok(ApiResponse.success("Next order retrieved successfully", nextOrder));
        } catch (Exception e) {
            log.error("Error getting next order for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get next order", e.getMessage()));
        }
    }

    /**
     * Helper method to extract teacher ID from JWT token
     */
    private String extractTeacherIdFromToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                throw new RuntimeException("Authorization token is required");
            }

            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Extract teacher ID using JwtService
            return jwtService.extractTeacherId(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token: " + e.getMessage());
        }
    }
}