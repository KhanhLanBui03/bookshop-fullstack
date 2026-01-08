package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.PublisherRequest;
import com.fit.monolithic.backend.dto.response.PublisherResponse;
import com.fit.monolithic.backend.entity.Publisher;
import com.fit.monolithic.backend.repository.PublisherRepository;
import com.fit.monolithic.backend.service.PublisherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PublisherServiceImpl  implements PublisherService {
    private final PublisherRepository publisherRepository;

    @Override
    public List<PublisherResponse> findAll() {
        log.info("In PublisherServiceImpl findAll");
        return publisherRepository.findAll()
                .stream()
                .map(publisher -> new PublisherResponse(
                        publisher.getId(),
                        publisher.getName(),
                        publisher.getDescription(),
                        publisher.getCountry()
                )).toList();
    }

    @Override
    public PublisherResponse save(PublisherRequest publisherRequest) {
        Publisher publisher = new Publisher();
        publisher.setName(publisherRequest.getName());
        publisher.setDescription(publisherRequest.getDescription());
        publisher.setCountry(publisherRequest.getCountry());
        publisherRepository.save(publisher);
        log.info("save publisher successfully");
        return new PublisherResponse(
                publisher.getId(),
                publisher.getName(),
                publisher.getDescription(),
                publisher.getCountry()
        );
    }

    @Override
    public PublisherResponse findById(Long id) {
        Publisher publisher = publisherRepository.findById(id) .orElseThrow(() ->
                new RuntimeException("Author not found with id: " + id)
        );
        log.info("find publisher successfully");
        return new PublisherResponse(
                publisher.getId(),
                publisher.getName(),
                publisher.getDescription(),
                publisher.getCountry()
        );
    }

    @Override
    public void deleteById(Long id) {
        Publisher publisher = publisherRepository.findById(id).orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));
        publisherRepository.delete(publisher);
        log.info("delete publisher successfully");
    }
}
