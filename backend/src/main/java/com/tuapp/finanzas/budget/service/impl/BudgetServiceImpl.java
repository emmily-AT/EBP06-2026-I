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

import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Override
    public BudgetDto update(Long id, BudgetDto dto) {

        if (dto.getLimitAmount() == null ||
                dto.getLimitAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "El monto debe ser mayor a cero"
            );
        }

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Presupuesto no encontrado"
                        ));

        var user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        ));

        if (!budget.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "No autorizado para editar este presupuesto"
            );
        }
        if (dto.getMonth() == null || dto.getYear() == null) {
            throw new IllegalArgumentException(
                "month and year are required"
            );
        }
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        if (budget.getYear() < currentYear ||
                (budget.getYear().equals(currentYear)
                        && budget.getMonth() < currentMonth)) {

            throw new RuntimeException(
                    "No es posible modificar presupuestos de meses anteriores"
            );
        }

        budget.setName(dto.getName());
        budget.setLimitAmount(dto.getLimitAmount());

        Budget saved = budgetRepository.save(budget);

        BudgetDto response = toDto(saved);

        return response;
    }

    @Override
    public void delete(Long id) {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No autorizado");
        }

        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear();

        if (budget.getYear() < currentYear ||
        (budget.getYear().equals(currentYear) && budget.getMonth() < currentMonth)) {

            throw new RuntimeException("No es posible eliminar presupuestos de meses anteriores");
        }

        budgetRepository.delete(budget);
    }
}
