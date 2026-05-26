package com.tuapp.finanzas.transaction.service;

import com.tuapp.finanzas.transaction.dto.TransactionDto;

import java.util.List;
import java.math.BigDecimal;

public interface TransactionService {
    TransactionDto create(TransactionDto dto);
    TransactionDto createExpense(TransactionDto dto);
    TransactionDto update(Long id, TransactionDto dto); 
    void delete(Long id);
    BigDecimal getBalance();
    List<TransactionDto> findAll();
    TransactionDto findById(Long id);
}
