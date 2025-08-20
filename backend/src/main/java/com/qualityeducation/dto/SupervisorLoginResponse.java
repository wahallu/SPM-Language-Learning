package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupervisorLoginResponse {
    private String token;
    private SupervisorResponse supervisor;
}
