package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.BlogRequest;
import com.fit.monolithic.backend.dto.response.BlogResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogService {
    BlogResponse createBlog(BlogRequest request, CustomUserDetails userDetails);
    BlogResponse updateBlog(Long id, BlogRequest request);
    void deleteBlog(Long id);
    BlogResponse getBlogById(Long id);
    BlogResponse getBlogBySlug(String slug);
    Page<BlogResponse> getAllBlogs(Pageable pageable);
    Page<BlogResponse> getPublishedBlogs(Pageable pageable);
    java.util.List<BlogResponse> getRelatedBlogs(Long id);
}
