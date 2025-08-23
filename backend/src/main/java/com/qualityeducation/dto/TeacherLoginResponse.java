package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeacherLoginResponse {
    private String token;
    private TeacherResponse teacher;
}