package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.BookRequest;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.entity.Book;

import java.util.List;

public interface BookService {
    BookResponse save(BookRequest bookRequest);
    List<BookResponse> findAll();
}