package com.qualityeducation.controller;

import com.qualityeducation.dto.*;
import com.qualityeducation.service.SupervisorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supervisor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class SupervisorController {
    
    private final SupervisorService supervisorService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<SupervisorResponse>> register(
            @Valid @RequestBody SupervisorRegistrationRequest request,
            BindingResult bindingResult) {
        
        // Handle validation errors
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
        
        // Handle validation errors
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SupervisorResponse>>> getAllSupervisors() {
        ApiResponse<List<SupervisorResponse>> response = supervisorService.getAllSupervisors();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<SupervisorResponse>>> getPendingSupervisors() {
        ApiResponse<List<SupervisorResponse>> response = supervisorService.getPendingSupervisors();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{supervisorId}/approve")
    public ResponseEntity<ApiResponse<SupervisorResponse>> approveSupervisor(
            @PathVariable String supervisorId) {
        
        ApiResponse<SupervisorResponse> response = supervisorService.approveSupervisor(supervisorId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{supervisorId}/reject")
    public ResponseEntity<ApiResponse<SupervisorResponse>> rejectSupervisor(
            @PathVariable String supervisorId,
            @RequestParam(required = false) String reason) {
        
        ApiResponse<SupervisorResponse> response = supervisorService.rejectSupervisor(supervisorId, reason);
        
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
    
    @PostMapping("/change-password/{supervisorId}")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable String supervisorId,
            @Valid @RequestBody ChangePasswordRequest request,
            BindingResult bindingResult) {
        
        // Handle validation errors
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
            
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Validation failed", errors));
        }
        
        ApiResponse<String> response = supervisorService.changePassword(supervisorId, request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
