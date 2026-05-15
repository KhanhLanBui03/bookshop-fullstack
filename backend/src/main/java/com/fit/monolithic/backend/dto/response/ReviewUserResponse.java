package com.fit.monolithic.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewUserResponse {
    private Long id;
    private String fullName;
    private boolean isAdmin;
}