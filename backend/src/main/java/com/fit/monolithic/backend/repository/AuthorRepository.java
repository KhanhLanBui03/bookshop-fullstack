package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    @Query("""
   SELECT new com.fit.monolithic.backend.dto.response.BookCardResponse(
        b.id,
        b.title,
        b.salePrice,
        b.originalPrice,
        b.rating,
        b.soldCount,
        i.url,
        b.author.name
   )
   FROM Book b
   LEFT JOIN b.images i
   WHERE b.author.id = :id
""")
    List<BookCardResponse> findByAuthorId(@Param("id") Long id);


}
