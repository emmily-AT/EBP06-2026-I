package com.tuapp.finanzas.transaction.strategy;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.service.TransactionService;
import org.springframework.stereotype.Component;

@Component
public class IncomeStrategy implements TransactionStrategy {

    private final TransactionService transactionService;

    public IncomeStrategy(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Override
    public TransactionDto process(TransactionDto dto) {
        return transactionService.create(dto);
    }
}