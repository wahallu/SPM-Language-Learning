package com.qualityeducation.controller;

import com.qualityeducation.model.User;
import com.qualityeducation.service.StudentService;
import com.qualityeducation.dto.ApiResponse;
import com.qualityeducation.dto.StudentProfileResponse;
import com.qualityeducation.dto.StudentStatsResponse;
import com.qualityeducation.dto.StudentActivityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    private final StudentService studentService;
    
    @GetMapping("/profile/{studentId}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentProfile(
            @PathVariable String studentId) {
        
        ApiResponse<StudentProfileResponse> response = studentService.getStudentProfile(studentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/profile/{studentId}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateStudentProfile(
            @PathVariable String studentId,
            @RequestBody User updateData) {
        
        ApiResponse<StudentProfileResponse> response = studentService.updateStudentProfile(studentId, updateData);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{studentId}/stats")
    public ResponseEntity<ApiResponse<StudentStatsResponse>> getStudentStats(
            @PathVariable String studentId) {
        
        ApiResponse<StudentStatsResponse> response = studentService.getStudentStats(studentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile/{studentId}/activities")
    public ResponseEntity<ApiResponse<List<StudentActivityResponse>>> getStudentActivities(
            @PathVariable String studentId) {
        
        ApiResponse<List<StudentActivityResponse>> response = studentService.getStudentActivities(studentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
