package com.tuapp.finanzas.budget.service.impl;

import com.tuapp.finanzas.budget.dto.BudgetDto;
import com.tuapp.finanzas.budget.entity.Budget;
import com.tuapp.finanzas.budget.repository.BudgetRepository;
import com.tuapp.finanzas.budget.service.BudgetService;
import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserLookup userLookup;

    public BudgetServiceImpl(BudgetRepository budgetRepository, UserLookup userLookup) {
        this.budgetRepository = budgetRepository;
        this.userLookup = userLookup;
    }

    @Override
    public BudgetDto create(BudgetDto dto) {
        if (dto.getLimitAmount() == null || dto.getLimitAmount().doubleValue() <= 0) {
            throw new IllegalArgumentException("limitAmount must be greater than zero");
        }
        Budget b = new Budget();
        b.setName(dto.getName());
        b.setLimitAmount(dto.getLimitAmount());
        b.setMonth(dto.getMonth());
        b.setYear(dto.getYear());

        // Resolve current user from SecurityContext
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            userLookup.findByUsername(auth.getName()).ifPresent(u -> b.setUser(u));
        }

        // Set category if provided
        if (dto.getCategoryId() != null) {
            Category c = new Category();
            c.setId(dto.getCategoryId());
            b.setCategory(c);
        }

        Budget saved = budgetRepository.save(b);
        return toDto(saved);
    }

    @Override
    public List<BudgetDto> findAll() {
        return budgetRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<BudgetDto> findByUserId(Long userId) {
        return budgetRepository.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public BudgetDto findById(Long id) {
        return budgetRepository.findById(id).map(this::toDto).orElse(null);
    }

    private BudgetDto toDto(Budget b) {
        BudgetDto dto = new BudgetDto(b.getId(), b.getName(), b.getLimitAmount());
        dto.setMonth(b.getMonth());
        dto.setYear(b.getYear());
        dto.setCategoryId(b.getCategory() != null ? b.getCategory().getId() : null);
        return dto;
    }


}
