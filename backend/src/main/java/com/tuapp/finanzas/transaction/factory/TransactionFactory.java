package com.tuapp.finanzas.transaction.factory;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import com.tuapp.finanzas.user.entity.User;

public interface TransactionFactory {

    Transaction create(
            TransactionDto dto,
            User user,
            TransactionType type
    );
}