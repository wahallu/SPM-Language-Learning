package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.service.SupervisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supervisor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SupervisorController {
    
    private final SupervisorService supervisorService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<SupervisorResponse>> register(
            @Valid @RequestBody SupervisorRegistrationRequest request,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
            
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Validation failed", errors));
        }
        
        ApiResponse<SupervisorResponse> response = supervisorService.registerSupervisor(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<SupervisorLoginResponse>> login(
            @Valid @RequestBody SupervisorLoginRequest request,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
            
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Validation failed", errors));
        }
        
        ApiResponse<SupervisorLoginResponse> response = supervisorService.loginSupervisor(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{supervisorId}")
    public ResponseEntity<ApiResponse<SupervisorResponse>> getSupervisorProfile(
            @PathVariable String supervisorId) {
        
        ApiResponse<SupervisorResponse> response = supervisorService.getSupervisorProfile(supervisorId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/profile/{supervisorId}")
    public ResponseEntity<ApiResponse<SupervisorResponse>> updateSupervisorProfile(
            @PathVariable String supervisorId,
            @RequestBody SupervisorUpdateRequest request) {
        
        ApiResponse<SupervisorResponse> response = supervisorService.updateSupervisorProfile(supervisorId, request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{supervisorId}/stats")
    public ResponseEntity<ApiResponse<SupervisorStatsResponse>> getSupervisorStats(
            @PathVariable String supervisorId) {
        
        ApiResponse<SupervisorStatsResponse> response = supervisorService.getSupervisorStats(supervisorId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{supervisorId}/activities")
    public ResponseEntity<ApiResponse<List<SupervisorActivityResponse>>> getSupervisorActivities(
            @PathVariable String supervisorId) {
        
        ApiResponse<List<SupervisorActivityResponse>> response = supervisorService.getSupervisorActivities(supervisorId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/lessons/{lessonId}/approve")
    public ResponseEntity<ApiResponse<String>> approveLesson(@PathVariable String lessonId) {
        ApiResponse<String> response = supervisorService.approveLesson(lessonId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/lessons/{lessonId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectLesson(
            @PathVariable String lessonId,
            @RequestBody Map<String, String> requestBody) {
        
        String reason = requestBody.get("reason");
        ApiResponse<String> response = supervisorService.rejectLesson(lessonId, reason);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
