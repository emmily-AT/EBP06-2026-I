package com.tuapp.finanzas.balance.service;

import com.tuapp.finanzas.balance.dto.MonthlyBalanceDto;
import com.tuapp.finanzas.balance.dto.YearlyBalanceDto;

public interface BalanceService {
    MonthlyBalanceDto getMonthlyBalance(Long userId, int year, int month);
    YearlyBalanceDto getYearlyBalance(Long userId, int year);
}
