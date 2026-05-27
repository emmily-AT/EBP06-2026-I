package com.tuapp.finanzas.alert.service;

public interface AlertService {
    void evaluateBudget(Long userId, Long categoryId, int year, int month);
}
