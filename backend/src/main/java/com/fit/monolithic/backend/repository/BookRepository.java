package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.dto.response.BookAdminResponse;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.entity.Author;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
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
                WHERE b.category.id = :categoryId
                  AND b.id <> :bookId
                  AND b.status = 'ACTIVE'
                ORDER BY b.soldCount DESC
            """)
    List<BookCardResponse> findRelatedBooks(
            @Param("categoryId") Long categoryId,
            @Param("bookId") Long bookId,
            Pageable pageable
    );

    List<Book> findTop10ByStatusOrderBySoldCountDesc(BookStatus status);

    @Query("""
            SELECT
            b.id,
            b.title,
            a.name,
            b.rating,
            b.soldCount,
            b.stock
            FROM Book b
            LEFT JOIN b.author a
            ORDER BY b.soldCount DESC
            """)
    List<Object[]> getTopBook(Pageable pageable);

    @Query("""
                SELECT
                    COUNT(b),
                    SUM(CASE WHEN b.status = com.fit.monolithic.backend.enums.BookStatus.ACTIVE THEN 1 ELSE 0 END),
                    SUM(CASE WHEN b.stock > 0 AND b.stock <= 5 THEN 1 ELSE 0 END),
                    SUM(CASE WHEN b.stock = 0 THEN 1 ELSE 0 END)
                FROM Book b
            """)
    List<Object[]> getBookDashboardStats();

    @Query("""
    SELECT new com.fit.monolithic.backend.dto.response.BookAdminResponse(
        b.id,
        b.title,
        p.name,
        a.name,
        (
            SELECT i.url
            FROM Image i
            WHERE i.book.id = b.id
            ORDER BY i.id ASC
            LIMIT 1
        ),
        c.name,
        b.salePrice,
        b.stock,
        b.soldCount,
        b.rating,
        b.status
    )
    FROM Book b
    LEFT JOIN b.author a
    LEFT JOIN b.category c
    LEFT JOIN b.publisher p
    ORDER BY b.createdAt DESC
""")
    List<BookAdminResponse> getAllBookAdmins();


}
