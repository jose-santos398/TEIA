package com.teia.sitebackend.factory;

import com.teia.sitebackend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * Factory para padronizar criação de respostas HTTP
 */
@Component
public class ResponseFactory {
    
    /**
     * Resposta de sucesso com dados (200 OK)
     */
    public static ResponseEntity<ApiResponse> success(String message, Object data) {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(new ApiResponse(true, message, data));
    }
    
    /**
     * Resposta de sucesso sem dados (200 OK)
     */
    public static ResponseEntity<ApiResponse> success(String message) {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(new ApiResponse(true, message));
    }
    
    /**
     * Resposta de criação bem-sucedida (201 CREATED)
     */
    public static ResponseEntity<ApiResponse> created(String message, Object data) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new ApiResponse(true, message, data));
    }
    
    /**
     * Resposta de criação bem-sucedida sem dados (201 CREATED)
     */
    public static ResponseEntity<ApiResponse> created(String message) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new ApiResponse(true, message));
    }
    
    /**
     * Resposta de requisição inválida (400 BAD REQUEST)
     */
    public static ResponseEntity<ApiResponse> badRequest(String message) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse(false, message));
    }
    
    /**
     * Resposta de requisição inválida com dados (400 BAD REQUEST)
     */
    public static ResponseEntity<ApiResponse> badRequest(String message, Object data) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse(false, message, data));
    }
    
    /**
     * Resposta de não autorizado (401 UNAUTHORIZED)
     */
    public static ResponseEntity<ApiResponse> unauthorized(String message) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponse(false, message));
    }
    
    /**
     * Resposta de recurso não encontrado (404 NOT FOUND)
     */
    public static ResponseEntity<ApiResponse> notFound(String message) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ApiResponse(false, message));
    }
    
    /**
     * Resposta de conflito (409 CONFLICT)
     */
    public static ResponseEntity<ApiResponse> conflict(String message) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ApiResponse(false, message));
    }
    
    /**
     * Resposta de erro interno do servidor (500 INTERNAL SERVER ERROR)
     */
    public static ResponseEntity<ApiResponse> internalError(String message) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiResponse(false, message));
    }
    
    /**
     * Resposta genérica com status customizado
     */
    public static ResponseEntity<ApiResponse> response(HttpStatus status, boolean success, String message) {
        return ResponseEntity
            .status(status)
            .body(new ApiResponse(success, message));
    }
    
    /**
     * Resposta genérica com status customizado e dados
     */
    public static ResponseEntity<ApiResponse> response(HttpStatus status, boolean success, String message, Object data) {
        return ResponseEntity
            .status(status)
            .body(new ApiResponse(success, message, data));
    }
}
