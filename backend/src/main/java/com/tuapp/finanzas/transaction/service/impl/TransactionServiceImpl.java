package com.tuapp.finanzas.transaction.service.impl;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.repository.TransactionRepository;
import com.tuapp.finanzas.transaction.service.TransactionService;
import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserLookup userLookup;

    public TransactionServiceImpl(TransactionRepository transactionRepository, UserLookup userLookup) {
        this.transactionRepository = transactionRepository;
        this.userLookup = userLookup;
    }

    @Override
    public TransactionDto create(TransactionDto dto) {
        Transaction t = new Transaction();
        t.setAmount(dto.getAmount());
        // set date explicitly: JPA may include a null date in INSERT which prevents DB default from applying
        if (dto.getDate() != null) {
            t.setDate(dto.getDate());
        } else {
            t.setDate(java.time.OffsetDateTime.now());
        }
        t.setDescription(dto.getDescription());
        if (dto.getCategoryId() != null) {
            Category c = new Category();
            c.setId(dto.getCategoryId());
            t.setCategory(c);
        }
        if (dto.getUserId() != null) {
            User u = new User();
            u.setId(dto.getUserId());
            t.setUser(u);
        } else {
            // try to resolve current user from security context if available
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                userLookup.findByUsername(auth.getName()).ifPresent(t::setUser);
            }
        }
        Transaction saved = transactionRepository.save(t);
        return toDto(saved);
    }

    @Override
    public List<TransactionDto> findAll() {
        return transactionRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public TransactionDto findById(Long id) {
        return transactionRepository.findById(id).map(this::toDto).orElse(null);
    }

    private TransactionDto toDto(Transaction t) {
        TransactionDto dto = new TransactionDto(
                t.getId(),
                t.getAmount(),
                t.getDescription(),
                t.getCategory() != null ? t.getCategory().getId() : null,
                t.getUser() != null ? t.getUser().getId() : null
        );
        dto.setDate(t.getDate());
        return dto;
    }
}
