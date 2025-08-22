package com.qualityeducation.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.util.List;

@Data
public class ModuleReorderRequest {

    @NotNull(message = "Module orders are required")
    private List<ModuleOrderItem> moduleOrders;

    @Data
    public static class ModuleOrderItem {
        @NotBlank(message = "Module ID is required")
        private String moduleId;

        @NotNull(message = "Order is required")
        @Min(value = 1, message = "Order must be at least 1")
        private Integer order;
    }
}