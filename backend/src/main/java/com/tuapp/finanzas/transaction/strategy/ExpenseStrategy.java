package com.tuapp.finanzas.transaction.strategy;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.facade.ExpenseFacade;
import org.springframework.stereotype.Component;

@Component
public class ExpenseStrategy implements TransactionStrategy {

    private final ExpenseFacade expenseFacade;

    public ExpenseStrategy(ExpenseFacade expenseFacade) {
        this.expenseFacade = expenseFacade;
    }

    @Override
    public TransactionDto process(TransactionDto dto) {
        return expenseFacade.registerExpense(dto);
    }
}