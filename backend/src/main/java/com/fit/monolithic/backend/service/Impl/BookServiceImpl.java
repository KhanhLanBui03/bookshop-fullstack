package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl {
    private final BookRepository bookRepository;


}
