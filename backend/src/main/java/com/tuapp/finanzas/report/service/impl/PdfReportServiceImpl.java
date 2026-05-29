package com.tuapp.finanzas.report.service.impl;

import com.tuapp.finanzas.report.dto.ReportResponseDto;
import com.tuapp.finanzas.report.service.PdfReportService;
import com.tuapp.finanzas.report.service.ReportService;
import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.lowagie.text.Document;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.lowagie.text.Element;
import com.lowagie.text.Font;

@Service
public class PdfReportServiceImpl implements PdfReportService {

    private final ReportService reportService;

    public PdfReportServiceImpl(
            ReportService reportService
    ) {
        this.reportService = reportService;
    }

    @Override
    public byte[] generatePdfReport(
            String type,
            int year,
            int month
    ) {

        ReportResponseDto report =
                reportService.generateTransactionReport(
                        type,
                        year,
                        month
                );

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        Document document =
                new Document(PageSize.A4);

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        20
                );

        Font sectionFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        14
                );

        Font headerFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        12
                );

        // =====================
        // TÍTULO
        // =====================

        Paragraph title =
                new Paragraph(
                        "FINANZAS PERSONALES",
                        titleFont
                );

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        Paragraph subtitle =
                new Paragraph(
                        "REPORTE DE TRANSACCIONES",
                        sectionFont
                );

        subtitle.setAlignment(Element.ALIGN_CENTER);

        document.add(subtitle);

        document.add(new Paragraph(" "));

        // =====================
        // INFORMACIÓN GENERAL
        // =====================

        String reportTypeText =
        switch (report.getType()) {
            case "INCOME" -> "Ingresos";
            case "EXPENSE" -> "Gastos";
            default -> report.getType();
        };

        document.add(
                new Paragraph(
                        "Tipo de reporte: "
                                + reportTypeText.toUpperCase()
                )
        );

        document.add(
                new Paragraph(
                        "Periodo: "
                                + report.getMonth()
                                + "/"
                                + report.getYear()
                )
        );

        document.add(
                new Paragraph(
                        "Fecha de generación: "
                                + LocalDateTime.now()
                                        .format(
                                                DateTimeFormatter.ofPattern(
                                                        "dd/MM/yyyy HH:mm"
                                                )
                                        )
                )
        );

        document.add(new Paragraph(" "));

        // =====================
        // RESUMEN
        // =====================

        document.add(
                new Paragraph(
                        "RESUMEN",
                        sectionFont
                )
        );

        document.add(
                new Paragraph(
                        "Cantidad de transacciones: "
                                + report.getTransactions().size()
                )
        );

        document.add(
                new Paragraph(
                        "Monto total: "
                                + report.getTotal()
                )
        );

        document.add(new Paragraph(" "));

        // =====================
        // TABLA
        // =====================

        document.add(
                new Paragraph(
                        "DETALLE DE TRANSACCIONES",
                        sectionFont
                )
        );

        document.add(new Paragraph(" "));

        if (report.getTransactions().isEmpty()) {

            document.add(
                    new Paragraph(
                            "No existen transacciones para el periodo seleccionado."
                    )
            );

        } else {

            PdfPTable table =
                    new PdfPTable(3);

            table.setWidthPercentage(100);

            table.setWidths(
                    new float[]{
                            3f,
                            7f,
                            3f
                    }
            );

            table.addCell(
                    new Phrase(
                            "Fecha",
                            headerFont
                    )
            );

            table.addCell(
                    new Phrase(
                            "Descripción",
                            headerFont
                    )
            );

            table.addCell(
                    new Phrase(
                            "Monto",
                            headerFont
                    )
            );

            for (TransactionDto tx :
                    report.getTransactions()) {

                table.addCell(
                        tx.getDate() != null
                                ? tx.getDate().toString()
                                : "-"
                );

                table.addCell(
                        tx.getDescription() != null
                                ? tx.getDescription()
                                : "-"
                );

                table.addCell(
                        tx.getAmount() != null
                                ? tx.getAmount().toString()
                                : "0"
                );
            }

            document.add(table);
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        // =====================
        // PIE DEL DOCUMENTO
        // =====================

        Paragraph footer =
                new Paragraph(
                        "Generado por Sistema de Finanzas Personales"
                );

        footer.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(footer);

        document.close();

        return out.toByteArray();
    }
}
