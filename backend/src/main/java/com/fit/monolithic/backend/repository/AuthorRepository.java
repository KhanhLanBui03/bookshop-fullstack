package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
