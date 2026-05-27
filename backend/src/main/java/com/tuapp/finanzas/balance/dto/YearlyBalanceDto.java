package com.tuapp.finanzas.balance.dto;

import java.math.BigDecimal;
import java.util.List;

public class YearlyBalanceDto {

    private List<MonthlySummaryDto> months;
    private BigDecimal total;

    public YearlyBalanceDto(List<MonthlySummaryDto> months) {
        this.months = months;
        this.total = months.stream()
                .map(m -> m.getIncome().subtract(m.getExpense()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<MonthlySummaryDto> getMonths() {
        return months;
    }

    public void setMonths(List<MonthlySummaryDto> months) {
        this.months = months;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}