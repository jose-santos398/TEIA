package com.teia.sitebackend.controller;

import com.teia.sitebackend.dto.CandidatoDTO;
import com.teia.sitebackend.dto.CurriculoAnaliseResponse;
import com.teia.sitebackend.exception.GlobalExceptionHandler;
import com.teia.sitebackend.mapper.CandidatoMapper;
import com.teia.sitebackend.model.Candidato;
import com.teia.sitebackend.service.CurriculoAnaliseService;
import com.teia.sitebackend.service.ICandidatoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CandidatoControllerTest {

    private MockMvc mockMvc;
    private ICandidatoService candidatoService;
    private CandidatoMapper candidatoMapper;
    private CurriculoAnaliseService curriculoAnaliseService;

    @BeforeEach
    void setUp() {
        candidatoService = Mockito.mock(ICandidatoService.class);
        candidatoMapper = Mockito.mock(CandidatoMapper.class);
        curriculoAnaliseService = Mockito.mock(CurriculoAnaliseService.class);

        CandidatoController controller = new CandidatoController(
            candidatoService,
            candidatoMapper,
            curriculoAnaliseService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void deveAceitarUploadDePdf() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "curriculo.pdf",
            MediaType.APPLICATION_PDF_VALUE,
            "pdf".getBytes()
        );

        Candidato candidato = new Candidato();
        candidato.setCandidato_id("123");
        candidato.setCurriculoNomeArquivo("curriculo.pdf");

        CandidatoDTO candidatoDTO = new CandidatoDTO();
        candidatoDTO.setCandidato_id("123");
        candidatoDTO.setCurriculoNomeArquivo("curriculo.pdf");
        candidatoDTO.setPossuiCurriculo(true);

        Mockito.when(candidatoService.atualizarCurriculo(eq("123"), eq("curriculo.pdf"), eq(MediaType.APPLICATION_PDF_VALUE), any()))
            .thenReturn(candidato);
        Mockito.when(candidatoMapper.toDTO(candidato)).thenReturn(candidatoDTO);

        mockMvc.perform(multipart("/candidato/{candidatoId}/curriculo", "123").file(file))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.curriculoNomeArquivo").value("curriculo.pdf"));
    }

    @Test
    void deveRejeitarUploadQueNaoSejaPdf() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "curriculo.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "docx".getBytes()
        );

        mockMvc.perform(multipart("/candidato/{candidatoId}/curriculo", "123").file(file))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Formato inválido. Envie apenas arquivo PDF"));
    }

    @Test
    void deveRetornarAnaliseComFormatoPadrao() throws Exception {
        CurriculoAnaliseResponse response = new CurriculoAnaliseResponse(
            "curriculo.pdf",
            "Resumo simples",
            List.of("Boa organizacao"),
            List.of("Adicionar metricas"),
            "Seu curriculo esta no caminho certo."
        );

        Mockito.when(curriculoAnaliseService.analisarCurriculo("123")).thenReturn(response);

        mockMvc.perform(post("/candidato/{candidatoId}/curriculo/analise", "123")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Análise de currículo gerada com sucesso"))
            .andExpect(jsonPath("$.data.nomeArquivo").value("curriculo.pdf"))
            .andExpect(jsonPath("$.data.pontosMelhoria[0]").value("Adicionar metricas"));
    }

    @Test
    void deveRemoverCurriculo() throws Exception {
        Candidato candidato = new Candidato();
        candidato.setCandidato_id("123");

        CandidatoDTO candidatoDTO = new CandidatoDTO();
        candidatoDTO.setCandidato_id("123");
        candidatoDTO.setPossuiCurriculo(false);

        Mockito.when(candidatoService.removerCurriculo("123")).thenReturn(candidato);
        Mockito.when(candidatoMapper.toDTO(candidato)).thenReturn(candidatoDTO);

        mockMvc.perform(delete("/candidato/{candidatoId}/curriculo", "123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Currículo removido com sucesso"))
            .andExpect(jsonPath("$.data.possuiCurriculo").value(false));
    }
}
