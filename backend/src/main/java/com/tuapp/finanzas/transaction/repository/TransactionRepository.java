package com.tuapp.finanzas.transaction.repository;

import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0)
    FROM Transaction t
    WHERE t.user.id = :userId
    AND t.category.id = :categoryId
    AND t.type = 'EXPENSE'
    AND EXTRACT(YEAR FROM t.date) = :year
    AND EXTRACT(MONTH FROM t.date) = :month
    """)
    BigDecimal sumExpensesByCategory(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("year") int year,
            @Param("month") int month
    );

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
    WHERE t.user.id = :userId
    AND t.type = :type
    """)
    BigDecimal sumByTypeAndUser(@Param("type") TransactionType type, @Param("userId") Long userId);

    @Query("""
    SELECT 
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount END), 0),
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount END), 0)
    FROM Transaction t
    WHERE t.user.id = :userId
    AND YEAR(t.date) = :year
    AND MONTH(t.date) = :month
    """)
    Object[] getMonthlyBalance(Long userId, int year, int month);

    @Query("""
    SELECT 
        MONTH(t.date),
        SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END),
        SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END)
    FROM Transaction t
    WHERE t.user.id = :userId
    AND YEAR(t.date) = :year
    GROUP BY MONTH(t.date)
    ORDER BY MONTH(t.date)
    """)
    List<Object[]> getYearlyBalance(Long userId, int year);

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndTypeAndDateBetweenOrderByDateDesc(
        Long userId,
        TransactionType type,
        OffsetDateTime start,
        OffsetDateTime end
    );
}
