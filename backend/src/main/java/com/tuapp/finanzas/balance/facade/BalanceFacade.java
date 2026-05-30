// balance/facade/BalanceFacade.java
package com.tuapp.finanzas.balance.facade;

import com.tuapp.finanzas.balance.dto.MonthlyBalanceDto;
import com.tuapp.finanzas.balance.dto.YearlyBalanceDto;

/**
 * Facade para consultas de balance del usuario autenticado.
 *
 * Oculta la resolución del usuario desde el SecurityContext,
 * desacoplando al controlador de UserLookup y Spring Security.
 */
public interface BalanceFacade {
    MonthlyBalanceDto getMonthlyBalance(int year, int month);
    YearlyBalanceDto getYearlyBalance(int year);
}