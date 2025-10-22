package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.service.JwtService;
import com.qualityeducation.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TeacherResponse>> register(
            @Valid @RequestBody TeacherRegistrationRequest request,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", errors));
        }

        ApiResponse<TeacherResponse> response = teacherService.registerTeacher(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TeacherLoginResponse>> login(
            @Valid @RequestBody TeacherLoginRequest request,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", errors));
        }

        ApiResponse<TeacherLoginResponse> response = teacherService.loginTeacher(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile/{teacherId}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherProfile(
            @PathVariable String teacherId) {

        ApiResponse<TeacherResponse> response = teacherService.getTeacherProfile(teacherId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        ApiResponse<String> response = teacherService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentEnrollmentResponse>>> getTeacherStudents(
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        try {
            String teacherId = extractTeacherIdFromToken(token);
            
            if (teacherId == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid or missing authorization token"));
            }
            
            ApiResponse<List<StudentEnrollmentResponse>> response = 
                    teacherService.getTeacherStudents(teacherId);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve students", e.getMessage()));
        }
    }

    @GetMapping("/students/{studentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<StudentDetailsResponse>> getStudentDetails(
            @PathVariable String studentId,
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        try {
            String teacherId = extractTeacherIdFromToken(token);
            
            if (teacherId == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid or missing authorization token"));
            }
            
            ApiResponse<StudentDetailsResponse> response = 
                    teacherService.getStudentDetails(studentId, teacherId);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve student details", e.getMessage()));
        }
    }
    
    /**
     * Extract teacher ID from JWT token
     */
    private String extractTeacherIdFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        
        String token = authorizationHeader.substring(7);
        return jwtService.extractTeacherId(token);
    }
}