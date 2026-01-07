package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.entity.Book;

import java.util.List;

public interface BookService {
    List<Book> findAll();
}
