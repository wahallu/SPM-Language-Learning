package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserLoginResponse {
    private String token;
    private UserResponse user;
}