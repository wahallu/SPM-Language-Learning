package com.qualityeducation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupervisorStatsResponse {
    private int teachersSupervised;
    private int coursesOverseeing;
    private int studentsImpacted;
    private int completedReviews;
    private int pendingReviews;
    private double approvalRate;
}
