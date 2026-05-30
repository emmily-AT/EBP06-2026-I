package com.tuapp.finanzas.budget.controller;

import com.tuapp.finanzas.budget.dto.BudgetDto;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import jakarta.validation.Valid;
import com.tuapp.finanzas.budget.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserLookup userLookup;

    public BudgetController(BudgetService budgetService, UserLookup userLookup) {
        this.budgetService = budgetService;
        this.userLookup = userLookup;
    }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> list() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(budgetService.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDto> get(@PathVariable Long id) {
        BudgetDto b = budgetService.findById(id);
        return b == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(b);
    }

    @PostMapping
    public ResponseEntity<BudgetDto> create(@Valid @RequestBody BudgetDto dto) {
        return ResponseEntity.ok(budgetService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(
            @PathVariable Long id,
            @RequestBody BudgetDto dto
    ) {
        return ResponseEntity.ok(budgetService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.ok("Presupuesto eliminado correctamente");
    }
}
