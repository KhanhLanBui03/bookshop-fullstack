package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.BookRequest;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.entity.Book;

import java.util.List;

public interface BookService {
    BookResponse save(BookRequest bookRequest);
    List<BookCardResponse> findAll();
    BookResponse findById(Long id);
    List<BookCardResponse> getBooksByAuthor(Long id);
    List<BookCardResponse> getTopBookBestSeller();
    List<BookCardResponse> getRelatedBooks(Long bookId);
}