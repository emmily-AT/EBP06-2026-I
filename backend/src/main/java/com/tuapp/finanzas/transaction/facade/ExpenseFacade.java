// transaction/facade/ExpenseFacade.java
package com.tuapp.finanzas.transaction.facade;

import com.tuapp.finanzas.transaction.dto.TransactionDto;

/**
 * Facade para el flujo de registro de gastos.
 *
 * Orquesta: TransactionService + AlertService.
 * El controlador habla con esta interfaz y no necesita
 * conocer cuántos servicios participan en el proceso.
 */
public interface ExpenseFacade {
    TransactionDto registerExpense(TransactionDto dto);
}