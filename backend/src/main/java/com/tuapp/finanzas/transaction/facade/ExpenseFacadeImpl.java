// transaction/facade/ExpenseFacadeImpl.java
package com.tuapp.finanzas.transaction.facade;

import com.tuapp.finanzas.alert.service.AlertService;
import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.service.TransactionService;
import org.springframework.stereotype.Component;

/**
 * Implementación del Facade de gastos.
 *
 * Patrón: GOF Facade
 * Responsabilidad: coordinar el caso de uso "registrar un gasto",
 * que involucra múltiples subsistemas sin que el controlador
 * los conozca directamente.
 *
 * Nota: usamos @Component (no @Service) para dejar claro
 * que este bean es un coordinador, no lógica de negocio pura.
 */
@Component
public class ExpenseFacadeImpl implements ExpenseFacade {

    private final TransactionService transactionService;
    private final AlertService alertService;

    public ExpenseFacadeImpl(TransactionService transactionService,
                             AlertService alertService) {
        this.transactionService = transactionService;
        this.alertService = alertService;
    }

    @Override
    public TransactionDto registerExpense(TransactionDto dto) {
        // Paso 1: persistir el gasto
        TransactionDto saved = transactionService.createExpense(dto);

        // Paso 2: evaluar presupuesto si hay usuario y categoría
        if (saved.getUserId() != null && saved.getCategoryId() != null) {
            alertService.evaluateBudget(
                    saved.getUserId(),
                    saved.getCategoryId(),
                    saved.getDate().getYear(),
                    saved.getDate().getMonthValue()
            );
        }

        // El controlador recibe el DTO listo, sin saber nada de alertas
        return saved;
    }
}