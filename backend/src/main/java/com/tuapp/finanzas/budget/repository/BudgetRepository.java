package com.tuapp.finanzas.budget.repository;

import com.tuapp.finanzas.budget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserIdAndCategoryIdAndMonthAndYear(
            Long userId,
            Long categoryId,
            Integer month,
            Integer year
    );

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    List<Budget> findByUserId(Long userId);
}
