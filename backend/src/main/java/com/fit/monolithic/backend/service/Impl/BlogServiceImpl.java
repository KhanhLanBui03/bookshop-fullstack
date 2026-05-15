package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.BlogRequest;
import com.fit.monolithic.backend.dto.response.BlogResponse;
import com.fit.monolithic.backend.entity.Blog;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.BlogRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BlogResponse createBlog(BlogRequest request, CustomUserDetails userDetails) {
        User author = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .slug(toSlug(request.getTitle()) + "-" + System.currentTimeMillis())
                .content(request.getContent())
                .thumbnail(request.getThumbnail())
                .summary(request.getSummary())
                .published(request.isPublished())
                .author(author)
                .build();

        return mapToResponse(blogRepository.save(blog));
    }

    @Override
    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setThumbnail(request.getThumbnail());
        blog.setSummary(request.getSummary());
        blog.setPublished(request.isPublished());

        return mapToResponse(blogRepository.save(blog));
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    @Override
    public BlogResponse getBlogById(Long id) {
        return blogRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    @Override
    public BlogResponse getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    @Override
    public Page<BlogResponse> getAllBlogs(Pageable pageable) {
        return blogRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<BlogResponse> getPublishedBlogs(Pageable pageable) {
        return blogRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable).map(this::mapToResponse);
    }

    @Override
    public java.util.List<BlogResponse> getRelatedBlogs(Long id) {
        return blogRepository.findTop3ByPublishedTrueAndIdNotOrderByCreatedAtDesc(id)
                .stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private BlogResponse mapToResponse(Blog blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .content(blog.getContent())
                .thumbnail(blog.getThumbnail())
                .summary(blog.getSummary())
                .published(blog.isPublished())
                .authorName(blog.getAuthor() != null ? blog.getAuthor().getFullName() : "Admin")
                .createdAt(blog.getCreatedAt())
                .build();
    }

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
