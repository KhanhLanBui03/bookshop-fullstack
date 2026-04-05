package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class FunnelStepResponse {
    private String label;
    private Long   value;
}