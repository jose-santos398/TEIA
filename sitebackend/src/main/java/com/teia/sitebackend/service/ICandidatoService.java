package com.teia.sitebackend.service;

import com.teia.sitebackend.model.Candidato;

import java.util.List;
import java.util.Optional;

/**
 * Interface para serviço de Candidato
 * Define o contrato de operações disponíveis
 */
public interface ICandidatoService {
    
    /**
     * Lista todos os candidatos
     */
    List<Candidato> getAll();
    
    /**
     * Busca candidato por ID
     */
    Optional<Candidato> getById(String id);
    
    /**
     * Salva um novo candidato ou atualiza existente
     */
    Candidato save(Candidato candidato);
    
    /**
     * Remove candidato por ID
     */
    void delete(String id);

    /**
     * Atualiza o currículo do candidato
     */
    Candidato atualizarCurriculo(String candidatoId, String nomeArquivo, String contentType, byte[] arquivo);

    Candidato removerCurriculo(String candidatoId);
    
    /**
     * Busca candidato por email
     */
    Optional<Candidato> findByEmail(String email);
    
    /**
     * Valida credenciais de login
     */
    Optional<Candidato> validarLogin(String email, String senha);
    
    /**
     * Verifica se email já existe
     */
    boolean emailJaExiste(String email);
    
    /**
     * Verifica se CPF já existe
     */
    boolean cpfJaExiste(String cpf);
}
