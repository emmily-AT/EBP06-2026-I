package com.tuapp.finanzas.report.service;

import com.tuapp.finanzas.report.dto.ReportResponseDto;

public interface ReportService {

    ReportResponseDto generateTransactionReport(
            String type,
            int year,
            int month
    );
}