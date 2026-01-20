package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.AuthorRequest;
import com.fit.monolithic.backend.dto.response.AuthorResponse;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.entity.Author;
import com.fit.monolithic.backend.enums.AuthorStatus;
import com.fit.monolithic.backend.repository.AuthorRepository;
import com.fit.monolithic.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorServiceImpl implements AuthorService {
    private final AuthorRepository authorRepository;

    @Override
    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll()
                .stream()
                .map(author -> new AuthorResponse(author.getId(),author.getName(),author.getEmail(),author.getStatus()))
                .toList();
    }

    @Override
    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Author not found with id: " + id)
                );
        return new AuthorResponse(
                author.getId(),
                author.getName(),
                author.getEmail(),
                author.getStatus()

        );
    }

    @Override
    public AuthorResponse save(AuthorRequest authorRequest) {
        Author author = new Author();
        author.setName(authorRequest.getName());
        author.setEmail(authorRequest.getEmail());
        author.setStatus(AuthorStatus.ACTIVE);
        authorRepository.save(author);
        return new AuthorResponse(
                author.getId(),
                author.getName(),
                author.getEmail(),
                author.getStatus()

        );
    }

    @Override
    public String deleteAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        authorRepository.delete(author);
        log.info("Author Deleted Successfully");
        return "Author Deleted Successfully";
    }

    @Override
    public AuthorResponse update(Long id, AuthorRequest authorRequest) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Author not found with id: " + id
                ));

        if (authorRequest.getName() != null &&
                !authorRequest.getName().equals(author.getName())) {
            author.setName(authorRequest.getName());
        }

        if (authorRequest.getEmail() != null &&
                !authorRequest.getEmail().equals(author.getEmail())) {
            author.setEmail(authorRequest.getEmail());
        }

        Author savedAuthor = authorRepository.save(author);

        log.info("Author updated successfully with id {}", id);

        return new AuthorResponse(
                savedAuthor.getId(),
                savedAuthor.getName(),
                savedAuthor.getEmail(),
                savedAuthor.getStatus()
        );
    }


}
