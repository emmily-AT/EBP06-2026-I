package com.tuapp.finanzas.balance.dto;

import java.math.BigDecimal;

public class MonthlySummaryDto {

    private int month;
    private BigDecimal income;
    private BigDecimal expense;

    public MonthlySummaryDto(int month, BigDecimal income, BigDecimal expense) {
        this.month = month;
        this.income = income;
        this.expense = expense;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }
}