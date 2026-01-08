package com.fit.monolithic.backend.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ================= VALIDATION BODY ================= */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleBodyValidation(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                errors
        );
    }

    /* ================= VALIDATION PARAM ================= */

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleParamValidation(
            ConstraintViolationException ex
    ) {
        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations()
                .forEach(v ->
                        errors.put(
                                v.getPropertyPath().toString(),
                                v.getMessage()
                        )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                errors
        );
    }

    /* ================= AUTH / BUSINESS ================= */

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleResponseStatus(
            ResponseStatusException ex
    ) {
        return buildResponse(
                HttpStatus.valueOf(ex.getStatusCode().value()),
                ex.getReason(),
                null
        );
    }

    /* ================= SECURITY ================= */

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(
            AccessDeniedException ex
    ) {
        return buildResponse(
                HttpStatus.FORBIDDEN,
                "Access denied",
                null
        );
    }

    /* ================= FALLBACK ================= */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleOther(
            Exception ex
    ) {
        ex.printStackTrace(); // dev only

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error",
                null
        );
    }

    /* ================= COMMON RESPONSE ================= */

    private ResponseEntity<?> buildResponse(
            HttpStatus status,
            String message,
            Object errors
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        if (errors != null) {
            body.put("errors", errors);
        }

        return ResponseEntity.status(status).body(body);
    }
}
