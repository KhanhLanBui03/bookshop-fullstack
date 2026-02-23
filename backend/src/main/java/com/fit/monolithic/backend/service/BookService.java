package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.BookRequest;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface BookService {
    BookResponse save(BookRequest bookRequest);
    List<BookCardResponse> findAll();
    BookResponse findById(Long id);
    List<BookCardResponse> getBooksByAuthor(Long id);
    List<BookCardResponse> getTopBookBestSeller();
    List<BookCardResponse> getRelatedBooks(Long bookId);
    Page<BookCardResponse> getBooks(String keyword, BigDecimal minPrice, BigDecimal maxPrice, String category, BigDecimal minRating, Pageable pageable);
}