package com.tuapp.finanzas.budget.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * DTO for budgets. Adds validation to ensure a positive limit amount
 * and a category/name is provided.
 */
public class BudgetDto {
    private Long id;

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "limitAmount is required")
    @DecimalMin(value = "0.01", message = "limitAmount must be greater than zero")
    private BigDecimal limitAmount;

    private Integer month;
    private Integer year;
    private Long categoryId;

    public BudgetDto() {}

    public BudgetDto(Long id, String name, BigDecimal limitAmount) {
        this.id = id;
        this.name = name;
        this.limitAmount = limitAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public java.math.BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(java.math.BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
