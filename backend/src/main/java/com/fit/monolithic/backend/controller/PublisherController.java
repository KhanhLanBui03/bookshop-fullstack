package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.PublisherRequest;
import com.fit.monolithic.backend.dto.response.PublisherResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.PublisherService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Publisher API", description = "Operations related to publisher")
@RestController
@RequestMapping("/api/v1/publishers")
@RequiredArgsConstructor
public class PublisherController {
    private final PublisherService publisherService;
    @GetMapping
    public ApiResponse<List<PublisherResponse>> findAll() {
        return new ApiResponse<>(
                200,
                "Success",
                publisherService.findAll()
        );
    }
    @PostMapping
    public ApiResponse<PublisherResponse> save (@Valid @RequestBody PublisherRequest publisherRequest) {
        return new  ApiResponse<>(
                201,
                "Success",
                publisherService.save(publisherRequest)
        );
    }
    @GetMapping("/{id}")
    public ApiResponse<PublisherResponse> findById(@Valid @PathVariable Long id) {
        return new ApiResponse<>(
                200,
                "Success",
                publisherService.findById(id)
        );
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteById(
            @PathVariable
            @Positive(message = "ID phải là số dương")
            Long id
    ) {
        publisherService.deleteById(id);
        return new ApiResponse<>(
                200,
                "Deleted successfully",
                null
        );
    }

}
