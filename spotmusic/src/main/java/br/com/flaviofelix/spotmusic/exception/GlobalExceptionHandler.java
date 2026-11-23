package br.com.flaviofelix.spotmusic.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> campos = new LinkedHashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      campos.put(error.getField(), error.getDefaultMessage());
    }

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Erro de validação");
    body.put("campos", campos);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler({NoResourceFoundException.class, NoSuchElementException.class, EntityNotFoundException.class})
  public ResponseEntity<Map<String, Object>> handleNotFound(Exception ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", HttpStatus.NOT_FOUND.value());
    body.put("error", "Recurso não encontrado");
    body.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, Object>> handleUnreadableMessage(HttpMessageNotReadableException ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Corpo da requisição inválido");
    body.put("message", "Verifique o formato do JSON enviado");

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
    body.put("error", "Erro interno do servidor");
    body.put("message", ex.getMessage());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
