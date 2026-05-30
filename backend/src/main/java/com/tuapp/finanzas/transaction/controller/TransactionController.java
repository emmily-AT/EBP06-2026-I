// transaction/controller/TransactionController.java
package com.tuapp.finanzas.transaction.controller;

import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import com.tuapp.finanzas.transaction.service.TransactionService;
import com.tuapp.finanzas.transaction.strategy.TransactionProcessor;
import com.tuapp.finanzas.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionProcessor transactionProcessor;
    private final UserLookup userLookup;

    public TransactionController(TransactionService transactionService,
                                 TransactionProcessor transactionProcessor,
                                 UserLookup userLookup) {
        this.transactionService = transactionService;
        this.transactionProcessor = transactionProcessor;
        this.userLookup = userLookup;
    }

    @GetMapping
    public ResponseEntity<List<TransactionDto>> list() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(transactionService.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> get(@PathVariable Long id) {
        TransactionDto t = transactionService.findById(id);
        return t == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(t);
    }

    @PostMapping
    public ResponseEntity<TransactionDto> create(
        @RequestBody TransactionDto dto) {

    return ResponseEntity.ok(
            transactionProcessor.process(
                    TransactionType.INCOME,
                    dto
            )
    );
}

    @PostMapping("/expense")
    public ResponseEntity<TransactionDto> createExpense(
            @RequestBody TransactionDto dto) {

        return ResponseEntity.ok(
                transactionProcessor.process(
                        TransactionType.EXPENSE,
                        dto
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> update(
            @PathVariable Long id,
            @RequestBody TransactionDto dto) {

        return ResponseEntity.ok(
                transactionService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        transactionService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/balance")
    public ResponseEntity<BigDecimal> getBalance() {
        return ResponseEntity.ok(transactionService.getBalance());
    }
}