package com.tuapp.finanzas.report.service.impl;

import com.tuapp.finanzas.report.dto.ReportResponseDto;
import com.tuapp.finanzas.report.service.ReportService;
import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import com.tuapp.finanzas.transaction.repository.TransactionRepository;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final TransactionRepository transactionRepository;
    private final UserLookup userLookup;

    public ReportServiceImpl(
            TransactionRepository transactionRepository,
            UserLookup userLookup
    ) {
        this.transactionRepository = transactionRepository;
        this.userLookup = userLookup;
    }

    @Override
    public ReportResponseDto generateTransactionReport(
            String type,
            int year,
            int month
    ) {

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        OffsetDateTime startDate =
                LocalDate.of(year, month, 1)
                        .atStartOfDay()
                        .atOffset(ZoneOffset.UTC);

        OffsetDateTime endDate =
                startDate.plusMonths(1).minusSeconds(1);

        TransactionType transactionType =
                TransactionType.valueOf(type.toUpperCase());

        List<TransactionDto> transactions =
                transactionRepository
                        .findByUserIdAndTypeAndDateBetweenOrderByDateDesc(
                                user.getId(),
                                transactionType,
                                startDate,
                                endDate
                        )
                        .stream()
                        .map(this::toDto)
                        .toList();

        BigDecimal total = transactions.stream()
                .map(TransactionDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        ReportResponseDto response =
                new ReportResponseDto();

        response.setType(type.toUpperCase());
        response.setYear(year);
        response.setMonth(month);
        response.setTotal(total);
        response.setTransactions(transactions);

        if (transactions.isEmpty()) {

            if (transactionType == TransactionType.EXPENSE) {
                response.setMessage(
                        "No existen gastos registrados"
                );
            } else {
                response.setMessage(
                        "No existen ingresos registrados"
                );
            }
        }

        return response;
    }

    private TransactionDto toDto(Transaction transaction) {

        TransactionDto dto = new TransactionDto();

        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setDate(transaction.getDate());

        if (transaction.getCategory() != null) {
            dto.setCategoryId(
                    transaction.getCategory().getId()
            );
        }

        if (transaction.getUser() != null) {
            dto.setUserId(
                    transaction.getUser().getId()
            );
        }

        return dto;
    }
}