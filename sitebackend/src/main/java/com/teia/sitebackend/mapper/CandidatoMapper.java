package com.teia.sitebackend.mapper;

import com.teia.sitebackend.dto.CandidatoCadastroRequest;
import com.teia.sitebackend.dto.CandidatoDTO;
import com.teia.sitebackend.model.Candidato;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para conversão entre Candidato (Entity) e DTOs
 */
@Component
public class CandidatoMapper {
    
    /**
     * Converte Entity para DTO (sem senha)
     */
    public CandidatoDTO toDTO(Candidato candidato) {
        if (candidato == null) {
            return null;
        }
        
        CandidatoDTO dto = new CandidatoDTO();
        dto.setCandidato_id(candidato.getCandidato_id());
        dto.setNome(candidato.getNome());
        dto.setCpf(candidato.getCpf());
        dto.setEmail(candidato.getEmail());
        dto.setCep(candidato.getCep());
        dto.setLogradouro(candidato.getLogradouro());
        dto.setNumero(candidato.getNumero());
        dto.setComplemento(candidato.getComplemento());
        dto.setBairro(candidato.getBairro());
        dto.setCidade(candidato.getCidade());
        dto.setEstado(candidato.getEstado());
        dto.setCurriculoNomeArquivo(candidato.getCurriculoNomeArquivo());
        dto.setPossuiCurriculo(candidato.getCurriculoArquivo() != null && candidato.getCurriculoArquivo().length > 0);
        // Não inclui senha por segurança
        
        return dto;
    }
    
    /**
     * Converte lista de Entities para lista de DTOs
     */
    public List<CandidatoDTO> toDTOList(List<Candidato> candidatos) {
        if (candidatos == null) {
            return null;
        }
        
        return candidatos.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Converte Request DTO para Entity (para cadastro)
     */
    public Candidato toEntity(CandidatoCadastroRequest request) {
        if (request == null) {
            return null;
        }
        
        Candidato candidato = new Candidato();
        candidato.setNome(request.getNome());
        candidato.setCpf(request.getCpf());
        candidato.setEmail(request.getEmail());
        candidato.setSenha(request.getSenha());
        candidato.setCep(request.getCep());
        candidato.setLogradouro(request.getLogradouro());
        candidato.setNumero(request.getNumero());
        candidato.setComplemento(request.getComplemento());
        candidato.setBairro(request.getBairro());
        candidato.setCidade(request.getCidade());
        candidato.setEstado(request.getEstado());
        
        return candidato;
    }
    
    /**
     * Atualiza Entity com dados do Request DTO
     */
    public void updateEntityFromRequest(Candidato candidato, CandidatoCadastroRequest request) {
        if (candidato == null || request == null) {
            return;
        }
        
        if (request.getNome() != null) {
            candidato.setNome(request.getNome());
        }
        if (request.getCpf() != null) {
            candidato.setCpf(request.getCpf());
        }
        if (request.getEmail() != null) {
            candidato.setEmail(request.getEmail());
        }
        if (request.getSenha() != null) {
            candidato.setSenha(request.getSenha());
        }
        if (request.getCep() != null) {
            candidato.setCep(request.getCep());
        }
        if (request.getLogradouro() != null) {
            candidato.setLogradouro(request.getLogradouro());
        }
        if (request.getNumero() != null) {
            candidato.setNumero(request.getNumero());
        }
        if (request.getComplemento() != null) {
            candidato.setComplemento(request.getComplemento());
        }
        if (request.getBairro() != null) {
            candidato.setBairro(request.getBairro());
        }
        if (request.getCidade() != null) {
            candidato.setCidade(request.getCidade());
        }
        if (request.getEstado() != null) {
            candidato.setEstado(request.getEstado());
        }
    }
}
