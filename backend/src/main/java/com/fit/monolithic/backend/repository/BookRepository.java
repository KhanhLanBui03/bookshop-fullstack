package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.entity.Author;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.enums.BookStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
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
    List<BookCardResponse> getBooksByAuthor(@Param("id") Long id);

    List<Book> findTop10ByStatusOrderBySoldCountDesc(BookStatus status);

}
