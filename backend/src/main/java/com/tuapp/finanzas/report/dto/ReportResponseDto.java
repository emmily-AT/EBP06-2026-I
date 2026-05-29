package com.tuapp.finanzas.report.dto;

import com.tuapp.finanzas.transaction.dto.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public class ReportResponseDto {

    private String type;

    private int year;

    private int month;

    private BigDecimal total;

    private List<TransactionDto> transactions;

    private String message;
    
    private String fullName;
    
    private String currency;

    public ReportResponseDto() {
    }

    public ReportResponseDto(
            String type,
            int year,
            int month,
            BigDecimal total,
            List<TransactionDto> transactions,
            String message,
            String fullName,
            String currency
    ) {
        this.type = type;
        this.year = year;
        this.month = month;
        this.total = total;
        this.transactions = transactions;
        this.message = message;
        this.fullName = fullName;
        this.currency = currency;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<TransactionDto> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionDto> transactions) {
        this.transactions = transactions;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    
}