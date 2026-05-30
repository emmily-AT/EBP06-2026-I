package com.tuapp.finanzas.balance.controller;

import com.tuapp.finanzas.balance.dto.MonthlyBalanceDto;
import com.tuapp.finanzas.balance.dto.YearlyBalanceDto;
import com.tuapp.finanzas.balance.facade.BalanceFacade;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/balance")
public class BalanceController {

    private final BalanceFacade balanceFacade; // ✅ solo el facade

    public BalanceController(BalanceFacade balanceFacade) {
        this.balanceFacade = balanceFacade;
    }

    @GetMapping("/monthly")
    public MonthlyBalanceDto monthly(@RequestParam int year, @RequestParam int month) {
        // ✅ El controlador no sabe nada de UserLookup ni SecurityContext
        return balanceFacade.getMonthlyBalance(year, month);
    }

    @GetMapping("/yearly")
    public YearlyBalanceDto yearly(@RequestParam int year) {
        return balanceFacade.getYearlyBalance(year);
    }
}