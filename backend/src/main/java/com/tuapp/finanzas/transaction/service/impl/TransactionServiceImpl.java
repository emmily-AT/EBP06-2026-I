package com.tuapp.finanzas.transaction.service.impl;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import com.tuapp.finanzas.transaction.factory.TransactionFactory;
import com.tuapp.finanzas.transaction.repository.TransactionRepository;
import com.tuapp.finanzas.transaction.service.TransactionService;
import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserLookup userLookup;
    private final TransactionFactory transactionFactory;

    // ✅ Un solo constructor, sin AlertService
    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  UserLookup userLookup,
                                  TransactionFactory transactionFactory) {
        this.transactionRepository = transactionRepository;
        this.userLookup = userLookup;
        this.transactionFactory = transactionFactory;
    }

    private User resolveUser(TransactionDto dto) {

        if (dto.getUserId() != null) {

            User u = new User();
            u.setId(dto.getUserId());

            return u;
        }

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth != null && auth.getName() != null) {

            return userLookup
                    .findByUsername(auth.getName())
                    .orElse(null);
        }

        return null;
    }

    private User getCurrentUser() {

    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || auth.getName() == null) {
        throw new RuntimeException("Usuario no autenticado");
    }

    return userLookup.findByUsername(auth.getName())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public TransactionDto create(TransactionDto dto) {
        User user = resolveUser(dto);

        Transaction t = transactionFactory.create(
                dto,
                user,
                TransactionType.INCOME
        );

        return toDto(transactionRepository.save(t));
    }

    @Override
    // ✅ createExpense ya NO evalúa presupuesto — esa responsabilidad
    //    fue movida al ExpenseFacade
    public TransactionDto createExpense(TransactionDto dto) {
        User user = resolveUser(dto);

        Transaction t = transactionFactory.create(
                dto,
                user,
                TransactionType.EXPENSE
        );

        return toDto(transactionRepository.save(t));
    }

    @Override
    public TransactionDto update(Long id, TransactionDto dto) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        User currentUser = getCurrentUser();

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No autorizado");
        }

        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());

        if (dto.getDate() != null) {
            transaction.setDate(dto.getDate());
        }

        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            transaction.setCategory(category);
        }

        Transaction updated = transactionRepository.save(transaction);

        return toDto(updated);
    }

    @Override
    public void delete(Long id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        User currentUser = getCurrentUser();

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No autorizado");
        }

        transactionRepository.delete(transaction);
    }

    @Override
    public BigDecimal getBalance() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Usuario no autenticado");
        }
        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        BigDecimal income = transactionRepository
                .sumByTypeAndUser(TransactionType.INCOME, user.getId());
        BigDecimal expense = transactionRepository
                .sumByTypeAndUser(TransactionType.EXPENSE, user.getId());

        return (income != null ? income : BigDecimal.ZERO)
        .subtract(expense != null ? expense : BigDecimal.ZERO);
    }

    @Override
    public List<TransactionDto> findAll() {
        return transactionRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<TransactionDto> findByUserId(Long userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public TransactionDto findById(Long id) {
        return transactionRepository.findById(id).map(this::toDto).orElse(null);
    }

    private TransactionDto toDto(Transaction t) {
        TransactionDto dto = new TransactionDto(
                t.getId(), t.getAmount(), t.getDescription(),
                t.getCategory() != null ? t.getCategory().getId() : null,
                t.getUser() != null ? t.getUser().getId() : null
        );
        dto.setDate(t.getDate());
        dto.setType(t.getType() != null ? t.getType().name() : null);
        return dto;
    }
}
