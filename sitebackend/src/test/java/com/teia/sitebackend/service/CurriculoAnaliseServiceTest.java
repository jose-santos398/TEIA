package com.teia.sitebackend.service;

import com.teia.sitebackend.client.CvAnalysisClient;
import com.teia.sitebackend.config.CvAnalysisProperties;
import com.teia.sitebackend.dto.CurriculoAnaliseResponse;
import com.teia.sitebackend.exception.ResourceNotFoundException;
import com.teia.sitebackend.exception.ValidationException;
import com.teia.sitebackend.model.Candidato;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

class CurriculoAnaliseServiceTest {

    private ICandidatoService candidatoService;
    private PdfCurriculoTextExtractor pdfCurriculoTextExtractor;
    private CvAnalysisClient cvAnalysisClient;
    private CurriculoAnaliseService curriculoAnaliseService;

    @BeforeEach
    void setUp() {
        candidatoService = Mockito.mock(ICandidatoService.class);
        pdfCurriculoTextExtractor = Mockito.mock(PdfCurriculoTextExtractor.class);
        cvAnalysisClient = Mockito.mock(CvAnalysisClient.class);

        CvAnalysisProperties properties = new CvAnalysisProperties();
        properties.setMaxChars(500);

        curriculoAnaliseService = new CurriculoAnaliseService(
            candidatoService,
            pdfCurriculoTextExtractor,
            cvAnalysisClient,
            properties
        );
    }

    @Test
    void deveRetornarAnaliseQuandoPdfForValido() throws IOException {
        Candidato candidato = criarCandidatoComCurriculo(MediaType.APPLICATION_PDF_VALUE);
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.of(candidato));
        Mockito.when(pdfCurriculoTextExtractor.extractText(any())).thenReturn(
            "Maria Silva email@email.com telefone 11999998888 possui experiencia com Java, Spring Boot e APIs REST."
        );
        Mockito.when(cvAnalysisClient.analisarCurriculo(any())).thenReturn(
            new CurriculoAnaliseInsights(
                "Curriculo bem estruturado",
                List.of("Boa clareza"),
                List.of("Adicionar metricas"),
                "Revise os detalhes finais."
            )
        );

        CurriculoAnaliseResponse response = curriculoAnaliseService.analisarCurriculo("123");

        assertEquals("curriculo.pdf", response.getNomeArquivo());
        assertEquals("Curriculo bem estruturado", response.getResumo());
        Mockito.verify(cvAnalysisClient).analisarCurriculo(eq(
            "Maria Silva [email ocultado] telefone [telefone ocultado] possui experiencia com Java, Spring Boot e APIs REST."
        ));
    }

    @Test
    void deveFalharQuandoCandidatoNaoExiste() {
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> curriculoAnaliseService.analisarCurriculo("123"));
    }

    @Test
    void deveFalharQuandoCurriculoNaoForPdf() {
        Candidato candidato = criarCandidatoComCurriculo("application/msword");
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.of(candidato));

        assertThrows(ValidationException.class, () -> curriculoAnaliseService.analisarCurriculo("123"));
    }

    @Test
    void deveFalharQuandoCurriculoNaoExiste() {
        Candidato candidato = new Candidato();
        candidato.setCandidato_id("123");
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.of(candidato));

        assertThrows(ResourceNotFoundException.class, () -> curriculoAnaliseService.analisarCurriculo("123"));
    }

    @Test
    void deveFalharQuandoPdfNaoTiverTextoUtil() throws IOException {
        Candidato candidato = criarCandidatoComCurriculo(MediaType.APPLICATION_PDF_VALUE);
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.of(candidato));
        Mockito.when(pdfCurriculoTextExtractor.extractText(any())).thenReturn("   ");

        assertThrows(ValidationException.class, () -> curriculoAnaliseService.analisarCurriculo("123"));
    }

    @Test
    void deveFalharQuandoLeituraDoPdfQuebrar() throws IOException {
        Candidato candidato = criarCandidatoComCurriculo(MediaType.APPLICATION_PDF_VALUE);
        Mockito.when(candidatoService.getById("123")).thenReturn(Optional.of(candidato));
        Mockito.when(pdfCurriculoTextExtractor.extractText(any())).thenThrow(new IOException("erro"));

        assertThrows(ValidationException.class, () -> curriculoAnaliseService.analisarCurriculo("123"));
    }

    private Candidato criarCandidatoComCurriculo(String contentType) {
        Candidato candidato = new Candidato();
        candidato.setCandidato_id("123");
        candidato.setCurriculoNomeArquivo("curriculo.pdf");
        candidato.setCurriculoContentType(contentType);
        candidato.setCurriculoArquivo("pdf".getBytes());
        return candidato;
    }
}
