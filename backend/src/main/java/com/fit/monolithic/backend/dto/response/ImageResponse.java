package com.fit.monolithic.backend.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ToString
public class ImageResponse {
    private Long id;
    private String name;
    private String url;
}
