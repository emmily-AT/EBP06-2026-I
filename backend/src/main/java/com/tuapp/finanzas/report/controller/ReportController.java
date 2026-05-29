package com.tuapp.finanzas.report.controller;

import com.tuapp.finanzas.report.service.ReportService;
import com.tuapp.finanzas.report.service.PdfReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final PdfReportService pdfReportService;

    public ReportController(ReportService reportService, PdfReportService pdfReportService) {
        this.reportService = reportService;
        this.pdfReportService = pdfReportService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> generateReport(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam int month
    ) {

        return ResponseEntity.ok(
                reportService.generateTransactionReport(
                        type,
                        year,
                        month
                )
        );
    }

    @GetMapping("/transactions/pdf")
    public ResponseEntity<byte[]> generatePdf(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam int month
    ) {

        byte[] pdf =
                pdfReportService.generatePdfReport(
                        type,
                        year,
                        month
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte.pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(pdf);
    }
}