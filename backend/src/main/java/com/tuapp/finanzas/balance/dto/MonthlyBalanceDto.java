package com.tuapp.finanzas.balance.dto;

import java.math.BigDecimal;

public class MonthlyBalanceDto {

    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal net;
    private String message;

    public MonthlyBalanceDto(BigDecimal income, BigDecimal expense) {
        this.income = income;
        this.expense = expense;
        this.net = income.subtract(expense);

        if (income.compareTo(BigDecimal.ZERO) == 0 &&
                expense.compareTo(BigDecimal.ZERO) == 0) {
            this.message = "Aún no tienes transacciones registradas en este período";
        } else if (net.compareTo(BigDecimal.ZERO) > 0) {
            this.message = "¡Buen trabajo! Tienes balance positivo";
        } else if (net.compareTo(BigDecimal.ZERO) < 0) {
            this.message = "Ten cuidado, tus gastos superan tus ingresos";
        } else {
            this.message = "Balance equilibrado";
        }
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

    public BigDecimal getNet() {
        return net;
    }

    public void setNet(BigDecimal net) {
        this.net = net;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}