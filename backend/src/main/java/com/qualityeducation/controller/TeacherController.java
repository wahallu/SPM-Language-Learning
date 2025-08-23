package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import jakarta.validation.Valid;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

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
}