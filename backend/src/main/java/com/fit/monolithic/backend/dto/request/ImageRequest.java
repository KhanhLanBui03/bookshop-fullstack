package com.fit.monolithic.backend.dto.request;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
@Getter
@Builder
public class ImageRequest {
    private String name;
    @Lob
    @NotBlank(message = "URL không được để trống!")
    private String url;
}
