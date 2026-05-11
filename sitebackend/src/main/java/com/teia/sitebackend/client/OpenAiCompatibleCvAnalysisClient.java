package com.teia.sitebackend.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teia.sitebackend.config.CvAnalysisProperties;
import com.teia.sitebackend.exception.ExternalServiceException;
import com.teia.sitebackend.service.CurriculoAnaliseInsights;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class OpenAiCompatibleCvAnalysisClient implements CvAnalysisClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(OpenAiCompatibleCvAnalysisClient.class);
    private static final String ANALISE_INDISPONIVEL = "A análise de currículo está indisponível no momento";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final CvAnalysisProperties properties;

    public OpenAiCompatibleCvAnalysisClient(
        @Qualifier("cvAnalysisRestClient") RestClient restClient,
        ObjectMapper objectMapper,
        CvAnalysisProperties properties
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    @Override
    public CurriculoAnaliseInsights analisarCurriculo(String textoCurriculo) {
        validarConfiguracao();

        ChatCompletionRequest request = new ChatCompletionRequest(
            properties.getModel(),
            List.of(
                new ChatMessage("system", """
                    Você analisa currículos em português do Brasil.
                    Responda apenas com JSON válido, sem markdown, sem crases e sem texto extra.
                    O JSON deve conter exatamente as chaves: resumo, pontosFortes, pontosMelhoria, mensagemFinal.
                    resumo deve ser uma string curta.
                    pontosFortes deve ter no máximo 3 itens.
                    pontosMelhoria deve ter no máximo 5 itens.
                    mensagemFinal deve ser uma orientação simples, amigável e objetiva.
                    Não invente experiência que não aparece no currículo.
                    Não faça promessas de contratação.
                    """),
                new ChatMessage("user", "Analise este currículo e sugira melhorias simples:\n\n" + textoCurriculo)
            ),
            1,
            new ResponseFormat("json_object"),
            properties.getMaxCompletionTokens(),
            properties.getReasoningEffort()
        );

        try {
            byte[] responseBody = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey())
                .body(request)
                .exchange((httpRequest, httpResponse) -> {
                    byte[] body = httpResponse.getBody().readAllBytes();

                    if (httpResponse.getStatusCode().isError()) {
                        LOGGER.error(
                            "OpenAI CV analysis request failed. status={}, statusText={}, responseBodySnippet={}",
                            httpResponse.getStatusCode().value(),
                            httpResponse.getStatusText(),
                            limitarTexto(toUtf8String(body))
                        );
                        throw new ExternalServiceException(ANALISE_INDISPONIVEL);
                    }

                    return body;
                });

            String responseText = toUtf8String(responseBody);
            ChatCompletionResponse response = objectMapper.readValue(responseText, ChatCompletionResponse.class);

            if (response == null || response.choices() == null || response.choices().isEmpty()
                || response.choices().get(0).message() == null
                || response.choices().get(0).message().content() == null
                || response.choices().get(0).message().content().isBlank()) {
                LOGGER.warn(
                    "OpenAI CV analysis returned empty content. finishReason={}, refusal={}, responseBodySnippet={}",
                    response != null && response.choices() != null && !response.choices().isEmpty()
                        ? response.choices().get(0).finish_reason()
                        : "<missing>",
                    response != null && response.choices() != null && !response.choices().isEmpty()
                        && response.choices().get(0).message() != null
                        ? response.choices().get(0).message().refusal()
                        : "<missing>",
                    limitarTexto(responseText)
                );
                throw new ExternalServiceException("A IA retornou uma resposta vazia para a análise do currículo");
            }

            CurriculoAnaliseInsights insights = objectMapper.readValue(
                limparJson(response.choices().get(0).message().content()),
                CurriculoAnaliseInsights.class
            );

            return normalizarInsights(insights);
        } catch (JsonProcessingException ex) {
            throw new ExternalServiceException("A IA retornou uma resposta inválida para a análise do currículo", ex);
        } catch (RestClientResponseException ex) {
            LOGGER.error(
                "OpenAI CV analysis request failed. status={}, statusText={}, responseBodySnippet={}",
                ex.getStatusCode().value(),
                ex.getStatusText(),
                limitarTexto(ex.getResponseBodyAsString())
            );
            throw new ExternalServiceException(ANALISE_INDISPONIVEL, ex);
        } catch (RestClientException ex) {
            LOGGER.error("OpenAI CV analysis request failed before a valid response was received: {}", ex.getMessage(), ex);
            throw new ExternalServiceException(ANALISE_INDISPONIVEL, ex);
        }
    }

    private void validarConfiguracao() {
        if (!properties.isEnabled()
            || estaEmBranco(properties.getBaseUrl())
            || estaEmBranco(properties.getApiKey())
            || estaEmBranco(properties.getModel())) {
            throw new ExternalServiceException(ANALISE_INDISPONIVEL);
        }
    }

    private CurriculoAnaliseInsights normalizarInsights(CurriculoAnaliseInsights insights) {
        if (insights == null || estaEmBranco(insights.getResumo()) || estaEmBranco(insights.getMensagemFinal())) {
            throw new ExternalServiceException("A IA retornou uma análise incompleta do currículo");
        }

        return new CurriculoAnaliseInsights(
            insights.getResumo().trim(),
            limitarLista(insights.getPontosFortes(), 3),
            limitarLista(insights.getPontosMelhoria(), 5),
            insights.getMensagemFinal().trim()
        );
    }

    private List<String> limitarLista(List<String> itens, int limite) {
        if (itens == null) {
            return List.of();
        }

        return itens.stream()
            .filter(item -> item != null && !item.isBlank())
            .map(String::trim)
            .limit(limite)
            .toList();
    }

    private String limparJson(String content) {
        String semCrases = content.trim();
        if (semCrases.startsWith("```")) {
            semCrases = semCrases.replaceFirst("^```(?:json)?", "");
            semCrases = semCrases.replaceFirst("```$", "");
        }
        return semCrases.trim();
    }

    private boolean estaEmBranco(String valor) {
        return valor == null || valor.isBlank();
    }

    private String limitarTexto(String valor) {
        if (valor == null || valor.isBlank()) {
            return "<empty>";
        }

        String texto = valor.replaceAll("\\s+", " ").trim();
        if (texto.length() <= 300) {
            return texto;
        }

        return texto.substring(0, 300) + "...";
    }

    private String toUtf8String(byte[] body) {
        return new String(body == null ? new byte[0] : body, StandardCharsets.UTF_8);
    }

    private record ChatCompletionRequest(
        String model,
        List<ChatMessage> messages,
        double temperature,
        ResponseFormat response_format,
        int max_completion_tokens,
        String reasoning_effort
    ) {
    }

    private record ChatMessage(String role, String content) {
    }

    private record ResponseFormat(String type) {
    }

    private record ChatCompletionResponse(List<Choice> choices) {
    }

    private record Choice(ChatMessageResponse message, String finish_reason) {
    }

    private record ChatMessageResponse(String content, String refusal) {
    }
}
