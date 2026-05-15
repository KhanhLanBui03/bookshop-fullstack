package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);
    Page<Blog> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    java.util.List<Blog> findTop3ByPublishedTrueAndIdNotOrderByCreatedAtDesc(Long id);
}
