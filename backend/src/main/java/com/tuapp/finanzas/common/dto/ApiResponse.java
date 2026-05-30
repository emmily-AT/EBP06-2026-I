package com.tuapp.finanzas.common.dto;

public record ApiResponse<T>(T data, String message) {
}
