package com.qualityeducation.controller;

import com.qualityeducation.dto.ApiResponse;
import com.qualityeducation.dto.CourseRequest;
import com.qualityeducation.dto.CourseResponse;
import com.qualityeducation.service.CourseService;
import com.qualityeducation.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" }, allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE,
        RequestMethod.OPTIONS }, allowCredentials = "true")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @RequestBody CourseRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) { // Make optional for better error
                                                                                      // handling
        try {
            String teacherId = extractTeacherIdFromToken(token);
            CourseResponse course = courseService.createCourse(request, teacherId);

            return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create course", e.getMessage()));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getCoursesByTeacher(
            @PathVariable String teacherId) {
        try {
            List<CourseResponse> courses = courseService.getCoursesByTeacher(teacherId);
            return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve courses", e.getMessage()));
        }
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(@PathVariable String courseId) {
        try {
            Optional<CourseResponse> course = courseService.getCourseById(courseId);

            if (course.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", course.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve course", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {
        try {
            List<CourseResponse> courses = courseService.getAllCourses();
            return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve courses", e.getMessage()));
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseRequest request) {
        try {
            CourseResponse course = courseService.updateCourse(courseId, request);
            return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update course", e.getMessage()));
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete course", e.getMessage()));
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

            // Use your existing JwtService to extract teacher ID
            return jwtService.extractTeacherId(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token: " + e.getMessage());
        }
    }
}