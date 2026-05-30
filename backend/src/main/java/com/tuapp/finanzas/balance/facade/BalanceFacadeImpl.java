// balance/facade/BalanceFacadeImpl.java
package com.tuapp.finanzas.balance.facade;

import com.tuapp.finanzas.balance.dto.MonthlyBalanceDto;
import com.tuapp.finanzas.balance.dto.YearlyBalanceDto;
import com.tuapp.finanzas.balance.service.BalanceService;
import com.tuapp.finanzas.user.entity.User;
import com.tuapp.finanzas.user.service.UserLookup;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Implementación del Facade de balance.
 *
 * Centraliza la resolución del usuario autenticado para que
 * ningún controlador necesite importar UserLookup ni Spring Security.
 */
@Component
public class BalanceFacadeImpl implements BalanceFacade {

    private final BalanceService balanceService;
    private final UserLookup userLookup;

    public BalanceFacadeImpl(BalanceService balanceService, UserLookup userLookup) {
        this.balanceService = balanceService;
        this.userLookup = userLookup;
    }

    // Método privado de apoyo: resuelve el usuario autenticado
    // Esta lógica estaba duplicada en cada controlador que necesitaba el userId
    private Long resolveCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userLookup.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return user.getId();
    }

    @Override
    public MonthlyBalanceDto getMonthlyBalance(int year, int month) {
        Long userId = resolveCurrentUserId();
        return balanceService.getMonthlyBalance(userId, year, month);
    }

    @Override
    public YearlyBalanceDto getYearlyBalance(int year) {
        Long userId = resolveCurrentUserId();
        return balanceService.getYearlyBalance(userId, year);
    }
}