package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.AuthorRequest;
import com.fit.monolithic.backend.dto.response.AuthorResponse;
import com.fit.monolithic.backend.entity.Author;

import java.util.List;

public interface AuthorService {
    List<AuthorResponse> getAllAuthors();
    AuthorResponse getAuthorById(Long id);
    AuthorResponse save(AuthorRequest authorRequest);
    String deleteAuthorById(Long id);
    AuthorResponse update(Long id,AuthorRequest authorRequest);
}
