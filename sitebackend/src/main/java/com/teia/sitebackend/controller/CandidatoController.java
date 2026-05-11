package com.teia.sitebackend.controller;

import com.teia.sitebackend.dto.ApiResponse;
import com.teia.sitebackend.dto.CandidatoCadastroRequest;
import com.teia.sitebackend.dto.CandidatoDTO;
import com.teia.sitebackend.dto.CurriculoAnaliseResponse;
import com.teia.sitebackend.dto.LoginRequest;
import com.teia.sitebackend.exception.ResourceNotFoundException;
import com.teia.sitebackend.exception.ValidationException;
import com.teia.sitebackend.factory.ResponseFactory;
import com.teia.sitebackend.mapper.CandidatoMapper;
import com.teia.sitebackend.model.Candidato;
import com.teia.sitebackend.service.CurriculoAnaliseService;
import com.teia.sitebackend.service.ICandidatoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/candidato")
public class CandidatoController {

    private final ICandidatoService candidatoService;
    private final CandidatoMapper candidatoMapper;
    private final CurriculoAnaliseService curriculoAnaliseService;

    public CandidatoController(
        ICandidatoService candidatoService,
        CandidatoMapper candidatoMapper,
        CurriculoAnaliseService curriculoAnaliseService
    ) {
        this.candidatoService = candidatoService;
        this.candidatoMapper = candidatoMapper;
        this.curriculoAnaliseService = curriculoAnaliseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        List<Candidato> candidatos = candidatoService.getAll();
        List<CandidatoDTO> candidatosDTO = candidatoMapper.toDTOList(candidatos);
        return ResponseFactory.success("Candidatos listados com sucesso", candidatosDTO);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody CandidatoCadastroRequest request) {
        Candidato candidato = candidatoMapper.toEntity(request);
        Candidato savedCandidato = candidatoService.save(candidato);
        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(savedCandidato);
        return ResponseFactory.created("Cadastro realizado com sucesso!", candidatoDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<Candidato> candidato = candidatoService.validarLogin(
            loginRequest.getEmail(),
            loginRequest.getSenha()
        );

        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(candidato.get());
        return ResponseFactory.success("Login realizado com sucesso!", candidatoDTO);
    }

    @PostMapping(value = "/{candidatoId}/curriculo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> uploadCurriculo(
        @PathVariable String candidatoId,
        @RequestPart("file") MultipartFile file
    ) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Selecione um arquivo de currículo para envio");
        }

        final long tamanhoMaximo = 5 * 1024 * 1024;
        if (file.getSize() > tamanhoMaximo) {
            throw new ValidationException("O currículo deve ter no máximo 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals(MediaType.APPLICATION_PDF_VALUE)) {
            throw new ValidationException("Formato inválido. Envie apenas arquivo PDF");
        }

        Candidato candidatoAtualizado = candidatoService.atualizarCurriculo(
            candidatoId,
            file.getOriginalFilename(),
            contentType,
            file.getBytes()
        );

        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(candidatoAtualizado);
        return ResponseFactory.success("Currículo enviado com sucesso", candidatoDTO);
    }

    @PostMapping("/{candidatoId}/curriculo/analise")
    public ResponseEntity<ApiResponse> analisarCurriculo(@PathVariable String candidatoId) {
        CurriculoAnaliseResponse analise = curriculoAnaliseService.analisarCurriculo(candidatoId);
        return ResponseFactory.success("Análise de currículo gerada com sucesso", analise);
    }

    @DeleteMapping("/{candidatoId}/curriculo")
    public ResponseEntity<ApiResponse> removerCurriculo(@PathVariable String candidatoId) {
        Candidato candidatoAtualizado = candidatoService.removerCurriculo(candidatoId);
        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(candidatoAtualizado);
        return ResponseFactory.success("Currículo removido com sucesso", candidatoDTO);
    }

    @GetMapping("/{candidatoId}/curriculo")
    public ResponseEntity<byte[]> baixarCurriculo(@PathVariable String candidatoId) {
        Candidato candidato = candidatoService.getById(candidatoId)
            .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado"));

        byte[] arquivo = candidato.getCurriculoArquivo();
        if (arquivo == null || arquivo.length == 0) {
            throw new ResourceNotFoundException("Currículo não encontrado para este candidato");
        }

        String nomeArquivo = candidato.getCurriculoNomeArquivo() != null
            ? candidato.getCurriculoNomeArquivo()
            : "curriculo.pdf";

        String contentType = candidato.getCurriculoContentType() != null
            ? candidato.getCurriculoContentType()
            : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
            .body(arquivo);
    }
}
