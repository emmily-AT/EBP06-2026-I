package com.tuapp.finanzas.transaction.strategy;

import com.tuapp.finanzas.transaction.dto.TransactionDto;

public interface TransactionStrategy {

    TransactionDto process(TransactionDto dto);

}