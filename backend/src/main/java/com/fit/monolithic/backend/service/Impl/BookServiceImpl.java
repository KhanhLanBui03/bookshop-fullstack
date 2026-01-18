package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.BookRequest;
import com.fit.monolithic.backend.dto.request.ImageRequest;
import com.fit.monolithic.backend.dto.request.PublisherRequest;
import com.fit.monolithic.backend.dto.response.BookCardResponse;
import com.fit.monolithic.backend.dto.response.BookResponse;
import com.fit.monolithic.backend.dto.response.ImageResponse;
import com.fit.monolithic.backend.dto.response.PublisherResponse;
import com.fit.monolithic.backend.entity.*;
import com.fit.monolithic.backend.enums.BookStatus;
import com.fit.monolithic.backend.repository.*;
import com.fit.monolithic.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final ImageRepository imageRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;

    public BookResponse mapToResponse(Book book) {
        BookResponse res = new BookResponse();
        res.setId(book.getId());
        res.setTitle(book.getTitle());
        res.setDescription(book.getDescription());
        res.setOriginalPrice(book.getOriginalPrice());
        res.setSalePrice(book.getSalePrice());
        res.setRating(book.getRating());
        res.setStock(book.getStock());
        res.setSoldCount(book.getSoldCount());
        res.setCreatedAt(book.getCreatedAt());

        res.setCategoryName(book.getCategory().getName());
        res.setAuthorName(book.getAuthor().getName());

        Publisher publisher = book.getPublisher();
        res.setPublisher(new PublisherResponse(
                publisher.getId(),
                publisher.getName(),
                publisher.getDescription(),
                publisher.getCountry()
        ));
        List<ImageResponse> images = book.getImages()
                .stream()
                .map(img -> new ImageResponse(
                        img.getId(),
                        img.getName(),
                        img.getUrl()
                ))
                .toList();

        res.setImages(images);

        return res;
    }

    public BookCardResponse mapToCardResponse(Book book) {

        String thumbnail = null;
        if (book.getImages() != null && !book.getImages().isEmpty()) {
            thumbnail = book.getImages().get(0).getUrl(); // lấy ảnh đầu
        }
        return new BookCardResponse(
                book.getId(),
                book.getTitle(),
                book.getSalePrice(),
                book.getOriginalPrice(),
                book.getRating(),
                book.getSoldCount(),
                thumbnail,
                book.getAuthor().getName()
        );
    }

    @Override
    public List<BookCardResponse> findAll() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToCardResponse)
                .toList();
    }

    @Override
    public BookResponse save(BookRequest bookRequest) {
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setDescription(bookRequest.getDescription());
        book.setOriginalPrice(bookRequest.getOriginalPrice());
        book.setSalePrice(bookRequest.getSalePrice());
        book.setRating(bookRequest.getRating());
        book.setStock(bookRequest.getStock());
        book.setSoldCount(0);
        Category category = categoryRepository.findById(bookRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        book.setCategory(category);
        Author author = authorRepository.findById(bookRequest.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        book.setAuthor(author);
        List<Image> images = bookRequest.getImages()
                .stream()
                .map(image -> {
                    Image imageEntity = new Image();
                    imageEntity.setName(image.getName());
                    imageEntity.setUrl(image.getUrl());
                    imageEntity.setBook(book);
                    return imageEntity;
                }).toList();
        book.setImages(images);
        book.setStatus(BookStatus.ACTIVE);
        Publisher publisher = publisherRepository.findById(bookRequest.getPublisherId())
                .orElseThrow(() -> new RuntimeException("Publisher not found"));
        book.setPublisher(publisher);
        log.info("Saving book {}", book);
        return mapToResponse(bookRepository.save(book));
    }

    @Override
    public BookResponse findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return mapToResponse(book);
    }
}
