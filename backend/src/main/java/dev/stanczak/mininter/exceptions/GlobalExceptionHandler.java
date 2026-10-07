package dev.stanczak.mininter.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import dev.stanczak.mininter.api.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return ResponseEntity
                .status(409)
                .body(ApiResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        return ResponseEntity
                .status(401)
                .body(ApiResponse.error(401, ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(400, ex.getMessage()));
    }

    @ExceptionHandler (PostNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handlePostNotFoundException(PostNotFoundException ex) {
        return ResponseEntity
                .status(404)
                .body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler (StorageException.class)
    public ResponseEntity<ApiResponse<String>> handleStorageException(StorageException ex) {
        return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, ex.getMessage()));
    }

    @ExceptionHandler (AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(403)
                .body(ApiResponse.error(403, ex.getMessage()));
    }

}
