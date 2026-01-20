package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.entity.Author;
import com.fit.monolithic.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {
    @Query("""
    SELECT new com.fit.monolithic.backend.dto.response.BookCardResponse(
        b.id,
        b.title,
        b.salePrice,
        b.originalPrice,
        b.rating,
        b.soldCount,
        (
            SELECT i.url
            FROM Image i
            WHERE i.book = b
              AND i.id = (
                  SELECT MIN(i2.id)
                  FROM Image i2
                  WHERE i2.book = b
              )
        ),
        a.name
    )
    FROM Book b
    LEFT JOIN b.author a
    WHERE a.id = :authorId
""")
    List<BookCardResponse> findByAuthorId(Long authorId);




}
