package com.tuapp.finanzas.transaction.strategy;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import org.springframework.stereotype.Component;

@Component
public class TransactionProcessor {

    private final IncomeStrategy incomeStrategy;
    private final ExpenseStrategy expenseStrategy;

    public TransactionProcessor(
            IncomeStrategy incomeStrategy,
            ExpenseStrategy expenseStrategy) {

        this.incomeStrategy = incomeStrategy;
        this.expenseStrategy = expenseStrategy;
    }

    public TransactionDto process(
            TransactionType type,
            TransactionDto dto) {

        return switch (type) {

            case INCOME -> incomeStrategy.process(dto);

            case EXPENSE -> expenseStrategy.process(dto);
        };
    }
}
