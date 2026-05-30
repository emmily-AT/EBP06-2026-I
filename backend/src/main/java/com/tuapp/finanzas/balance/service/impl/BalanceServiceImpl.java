package com.tuapp.finanzas.balance.service.impl;

import com.tuapp.finanzas.balance.dto.MonthlyBalanceDto;
import com.tuapp.finanzas.balance.dto.MonthlySummaryDto;
import com.tuapp.finanzas.balance.dto.YearlyBalanceDto;
import com.tuapp.finanzas.balance.service.BalanceService;
import com.tuapp.finanzas.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BalanceServiceImpl implements BalanceService {

    private final TransactionRepository transactionRepository;

    public BalanceServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public MonthlyBalanceDto getMonthlyBalance(Long userId, int year, int month) {

        Object[] result = transactionRepository
                .getMonthlyBalance(userId, year, month);

        BigDecimal income = (BigDecimal) result[0];
        BigDecimal expense = (BigDecimal) result[1];

        return new MonthlyBalanceDto(income, expense);
    }

    @Override
    public YearlyBalanceDto getYearlyBalance(Long userId, int year) {

        List<Object[]> results =
                transactionRepository.getYearlyBalance(userId, year);

        List<MonthlySummaryDto> months = results.stream()
                .map(r -> new MonthlySummaryDto(
                        (Integer) r[0],
                        (BigDecimal) r[1],
                        (BigDecimal) r[2]
                ))
                .toList();

        return new YearlyBalanceDto(months);
    }
}