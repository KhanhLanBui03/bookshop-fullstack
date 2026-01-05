package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book,Long> {
}
