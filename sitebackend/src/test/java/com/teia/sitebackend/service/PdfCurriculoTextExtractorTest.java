package com.teia.sitebackend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertTrue;

class PdfCurriculoTextExtractorTest {

    private final PdfCurriculoTextExtractor extractor = new PdfCurriculoTextExtractor();

    @Test
    void deveExtrairTextoDoPdf() throws IOException {
        System.setProperty("pdfbox.fontcache", "target/pdfbox-font-cache");
        byte[] pdf = criarPdf("Experiencia com Java e Spring Boot");

        String texto = extractor.extractText(pdf);

        assertTrue(texto.contains("Experiencia com Java e Spring Boot"));
    }

    private byte[] criarPdf(String texto) throws IOException {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText(texto);
                contentStream.endText();
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }
}
