package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.BlogRequest;
import com.fit.monolithic.backend.dto.response.BlogResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.BlogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Blog APIs", description = "Operations related to blogs")
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public ApiResponse<Page<BlogResponse>> getPublishedBlogs(@PageableDefault(size = 10) Pageable pageable) {
        return new ApiResponse<>(200, "Success", blogService.getPublishedBlogs(pageable));
    }

    @GetMapping("/related/{id}")
    public ApiResponse<java.util.List<BlogResponse>> getRelatedBlogs(@PathVariable Long id) {
        return new ApiResponse<>(200, "Success", blogService.getRelatedBlogs(id));
    }

    @GetMapping("/{slug}")
    public ApiResponse<BlogResponse> getBlogBySlug(@PathVariable String slug) {
        return new ApiResponse<>(200, "Success", blogService.getBlogBySlug(slug));
    }

    // Admin APIs
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BlogResponse> createBlog(
            @Valid @RequestBody BlogRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return new ApiResponse<>(201, "Blog created", blogService.createBlog(request, userDetails));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BlogResponse> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest request) {
        return new ApiResponse<>(200, "Blog updated", blogService.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return new ApiResponse<>(200, "Blog deleted", null);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<BlogResponse>> getAllBlogs(@PageableDefault(size = 10) Pageable pageable) {
        return new ApiResponse<>(200, "Success", blogService.getAllBlogs(pageable));
    }
}
