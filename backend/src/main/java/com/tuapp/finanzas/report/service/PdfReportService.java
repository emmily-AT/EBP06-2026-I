package com.tuapp.finanzas.report.service;


public interface PdfReportService {

    byte[] generatePdfReport(
            String type,
            int year,
            int month
    );
}
