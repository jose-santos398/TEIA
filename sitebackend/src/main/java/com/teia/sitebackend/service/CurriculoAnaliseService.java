package com.teia.sitebackend.service;

import com.teia.sitebackend.client.CvAnalysisClient;
import com.teia.sitebackend.config.CvAnalysisProperties;
import com.teia.sitebackend.dto.CurriculoAnaliseResponse;
import com.teia.sitebackend.exception.ResourceNotFoundException;
import com.teia.sitebackend.exception.ValidationException;
import com.teia.sitebackend.model.Candidato;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CurriculoAnaliseService {

    private static final int TAMANHO_MINIMO_TEXTO = 30;

    private final ICandidatoService candidatoService;
    private final PdfCurriculoTextExtractor pdfCurriculoTextExtractor;
    private final CvAnalysisClient cvAnalysisClient;
    private final CvAnalysisProperties properties;

    public CurriculoAnaliseService(
        ICandidatoService candidatoService,
        PdfCurriculoTextExtractor pdfCurriculoTextExtractor,
        CvAnalysisClient cvAnalysisClient,
        CvAnalysisProperties properties
    ) {
        this.candidatoService = candidatoService;
        this.pdfCurriculoTextExtractor = pdfCurriculoTextExtractor;
        this.cvAnalysisClient = cvAnalysisClient;
        this.properties = properties;
    }

    public CurriculoAnaliseResponse analisarCurriculo(String candidatoId) {
        Candidato candidato = candidatoService.getById(candidatoId)
            .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado"));

        byte[] arquivo = candidato.getCurriculoArquivo();
        if (arquivo == null || arquivo.length == 0) {
            throw new ResourceNotFoundException("Currículo não encontrado para este candidato");
        }

        if (!MediaType.APPLICATION_PDF_VALUE.equalsIgnoreCase(candidato.getCurriculoContentType())) {
            throw new ValidationException("A análise está disponível apenas para currículos em PDF");
        }

        String textoExtraido;
        try {
            textoExtraido = pdfCurriculoTextExtractor.extractText(arquivo);
        } catch (IOException ex) {
            throw new ValidationException("Não foi possível ler o currículo em PDF");
        }

        String textoPreparado = prepararTextoParaAnalise(textoExtraido);
        if (textoPreparado.length() < TAMANHO_MINIMO_TEXTO) {
            throw new ValidationException("Não foi possível extrair texto útil do currículo em PDF");
        }

        CurriculoAnaliseInsights insights = cvAnalysisClient.analisarCurriculo(textoPreparado);
        String nomeArquivo = candidato.getCurriculoNomeArquivo() != null && !candidato.getCurriculoNomeArquivo().isBlank()
            ? candidato.getCurriculoNomeArquivo()
            : "curriculo.pdf";

        return new CurriculoAnaliseResponse(
            nomeArquivo,
            insights.getResumo(),
            insights.getPontosFortes(),
            insights.getPontosMelhoria(),
            insights.getMensagemFinal()
        );
    }

    String prepararTextoParaAnalise(String textoExtraido) {
        if (textoExtraido == null) {
            return "";
        }

        String textoNormalizado = textoExtraido
            .replaceAll("[\\r\\n\\t]+", " ")
            .replaceAll("\\s{2,}", " ")
            .trim();

        textoNormalizado = mascararDadosSensiveis(textoNormalizado);

        int maxChars = properties.getMaxChars();
        if (maxChars > 0 && textoNormalizado.length() > maxChars) {
            textoNormalizado = textoNormalizado.substring(0, maxChars);
        }

        return textoNormalizado;
    }

    private String mascararDadosSensiveis(String texto) {
        return texto
            .replaceAll("(?i)\\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}\\b", "[email ocultado]")
            .replaceAll("(?<!\\d)(?:\\+?55\\s?)?(?:\\(?\\d{2}\\)?\\s?)?(?:9?\\d{4}[-\\s]?\\d{4})(?!\\d)", "[telefone ocultado]")
            .replaceAll("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b", "[cpf ocultado]");
    }
}
