package com.tuapp.finanzas.budget.service;

import com.tuapp.finanzas.budget.dto.BudgetDto;

import java.util.List;

public interface BudgetService {
    BudgetDto create(BudgetDto dto);
    List<BudgetDto> findAll();
    List<BudgetDto> findByUserId(Long userId);
    BudgetDto findById(Long id);
    BudgetDto update(Long id, BudgetDto dto);
    void delete(Long id);
}
