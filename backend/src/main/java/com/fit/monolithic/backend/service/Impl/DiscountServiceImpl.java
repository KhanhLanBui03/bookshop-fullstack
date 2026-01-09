package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.DiscountRequest;
import com.fit.monolithic.backend.dto.response.DiscountResponse;
import com.fit.monolithic.backend.entity.Discount;
import com.fit.monolithic.backend.repository.DiscountRepository;
import com.fit.monolithic.backend.service.DiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountServiceImpl implements DiscountService {
    private final DiscountRepository discountRepository;
    public DiscountResponse mapToResponse(Discount discount) {
        return new DiscountResponse(
                discount.getId(),
                discount.getName(),
                discount.getCode(),
                discount.getDiscountTargetType(),
                discount.getDiscountValueType(),
                discount.getDiscountValue(),
                discount.getDiscountMaxAmount(),
                discount.getDiscountStartDate(),
                discount.getDiscountEndDate(),
                discount.getDiscountQuantityLimit(),
                discount.isDiscountActive()
        );
    }

    @Override
    public List<DiscountResponse> getAllDiscount() {
        log.info("Getting all discounts");
        return discountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DiscountResponse getDiscountById(Long id) {

        Discount discount = discountRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        log.info("Getting discount by id {}", id);
        return mapToResponse(discount);
    }

    @Override
    public DiscountResponse create(DiscountRequest request) {
        if (discountRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Discount code already exists"
            );
        }
        if (request.getDiscountEndDate().isBefore(request.getDiscountStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date must be after start date"
            );
        }

        Discount discount = new Discount();
        discount.setName(request.getName());
        discount.setCode(request.getCode());
        discount.setDiscountTargetType(request.getDiscountTargetType());
        discount.setDiscountValueType(request.getDiscountValueType());
        discount.setDiscountValue(request.getDiscountValue());
        discount.setDiscountMaxAmount(request.getDiscountMaxAmount());
        discount.setDiscountStartDate(request.getDiscountStartDate());
        discount.setDiscountEndDate(request.getDiscountEndDate());
        discount.setDiscountQuantityLimit(request.getDiscountQuantityLimit());
        discount.setDiscountActive(
                request.getDiscountActive() != null && request.getDiscountActive()
        );
        Discount saved = discountRepository.save(discount);
        log.info("Saved Discount {}", saved);
        return mapToResponse(saved);
    }


    @Override
    public DiscountResponse updateDiscountById(Long id, DiscountRequest discountRequest) {
        Discount discount = discountRepository.findById(id).orElseThrow(
                ()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount id not found")
        );
        discount.setName(discountRequest.getName());
        discount.setCode(discountRequest.getCode());
        discount.setDiscountTargetType(discountRequest.getDiscountTargetType());
        discount.setDiscountValueType(discountRequest.getDiscountValueType());
        discount.setDiscountValue(discountRequest.getDiscountValue());
        discount.setDiscountMaxAmount(discountRequest.getDiscountMaxAmount());
        discount.setDiscountStartDate(discountRequest.getDiscountStartDate());
        discount.setDiscountEndDate(discountRequest.getDiscountEndDate());
        discount.setDiscountQuantityLimit(discountRequest.getDiscountQuantityLimit());
        discount.setDiscountActive(discountRequest.getDiscountActive());
        Discount saved = discountRepository.save(discount);
        log.info("Updated Discount with id {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public void deleteDiscountById(Long id) {
        Discount discount = discountRepository.findById(id).orElseThrow(
                ()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount id not found")
        );
        discountRepository.delete(discount);
        log.info("Discount with id {} has been deleted", id);
    }
}
