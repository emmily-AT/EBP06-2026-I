package com.tuapp.finanzas.transaction.service;

import com.tuapp.finanzas.transaction.dto.TransactionDto;

import java.util.List;

public interface TransactionService {
    TransactionDto create(TransactionDto dto);
    TransactionDto createExpense(TransactionDto dto);
    Double getBalance();
    List<TransactionDto> findAll();
    TransactionDto findById(Long id);
}
