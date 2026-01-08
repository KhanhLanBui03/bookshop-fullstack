package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.PublisherRequest;
import com.fit.monolithic.backend.dto.response.PublisherResponse;
import com.fit.monolithic.backend.entity.Publisher;

import java.util.List;

public interface PublisherService {
    List<PublisherResponse> findAll();
    PublisherResponse save(PublisherRequest publisherRequest);
    PublisherResponse findById(Long id);
    void deleteById(Long id);
}
