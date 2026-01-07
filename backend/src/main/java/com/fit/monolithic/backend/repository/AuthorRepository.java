package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
