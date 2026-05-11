package com.teia.sitebackend.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teia.sitebackend.config.CvAnalysisProperties;
import com.teia.sitebackend.exception.ExternalServiceException;
import com.teia.sitebackend.service.CurriculoAnaliseInsights;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenAiCompatibleCvAnalysisClientTest {

    private MockRestServiceServer server;
    private OpenAiCompatibleCvAnalysisClient client;

    @BeforeEach
    void setUp() {
        CvAnalysisProperties properties = new CvAnalysisProperties();
        properties.setEnabled(true);
        properties.setBaseUrl("https://example.test/v1");
        properties.setApiKey("test-key");
        properties.setModel("gpt-test");

        RestClient.Builder builder = RestClient.builder().baseUrl(properties.getBaseUrl());
        server = MockRestServiceServer.bindTo(builder).build();

        client = new OpenAiCompatibleCvAnalysisClient(
            builder.build(),
            new ObjectMapper(),
            properties
        );
    }

    @Test
    void deveMapearRespostaDaIaComLimites() {
        server.expect(requestTo("https://example.test/v1/chat/completions"))
            .andExpect(method(HttpMethod.POST))
            .andExpect(header("Authorization", "Bearer test-key"))
            .andRespond(withSuccess("""
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"resumo\\":\\"Curriculo claro e objetivo.\\",\\"pontosFortes\\":[\\"Resumo inicial bom\\",\\"Experiencia organizada\\",\\"Tecnologias relevantes\\",\\"Item extra\\"],\\"pontosMelhoria\\":[\\"Detalhar resultados\\",\\"Incluir metricas\\",\\"Ajustar formatacao\\",\\"Adicionar projetos\\",\\"Revisar portugues\\",\\"Extra\\"],\\"mensagemFinal\\":\\"Com pequenos ajustes, seu curriculo ficara ainda mais forte.\\"}"
                      }
                    }
                  ]
                }
                """, MediaType.APPLICATION_JSON));

        CurriculoAnaliseInsights response = client.analisarCurriculo("Texto do curriculo");

        assertEquals("Curriculo claro e objetivo.", response.getResumo());
        assertEquals(3, response.getPontosFortes().size());
        assertEquals(5, response.getPontosMelhoria().size());
        assertEquals("Com pequenos ajustes, seu curriculo ficara ainda mais forte.", response.getMensagemFinal());
    }

    @Test
    void deveFalharQuandoIaRetornaJsonInvalido() {
        server.expect(requestTo("https://example.test/v1/chat/completions"))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess("""
                {
                  "choices": [
                    {
                      "message": {
                        "content": "nao-e-json"
                      }
                    }
                  ]
                }
                """, MediaType.APPLICATION_JSON));

        assertThrows(ExternalServiceException.class, () -> client.analisarCurriculo("Texto do curriculo"));
    }

    @Test
    void deveMapearRespostaMesmoQuandoContentTypeForOctetStream() {
        server.expect(requestTo("https://example.test/v1/chat/completions"))
            .andExpect(method(HttpMethod.POST))
            .andExpect(header("Authorization", "Bearer test-key"))
            .andRespond(withSuccess("""
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"resumo\\":\\"Curriculo objetivo.\\",\\"pontosFortes\\":[\\"Boa organizacao\\"],\\"pontosMelhoria\\":[\\"Melhorar escrita\\"],\\"mensagemFinal\\":\\"Revise os detalhes finais.\\"}"
                      }
                    }
                  ]
                }
                """, MediaType.APPLICATION_OCTET_STREAM));

        CurriculoAnaliseInsights response = client.analisarCurriculo("Texto do curriculo");

        assertEquals("Curriculo objetivo.", response.getResumo());
        assertEquals("Boa organizacao", response.getPontosFortes().get(0));
        assertEquals("Melhorar escrita", response.getPontosMelhoria().get(0));
        assertEquals("Revise os detalhes finais.", response.getMensagemFinal());
    }
}
