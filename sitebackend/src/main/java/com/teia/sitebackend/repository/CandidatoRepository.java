package com.teia.sitebackend.repository;

import com.teia.sitebackend.model.Candidato;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidatoRepository extends MongoRepository<Candidato, String> {
    
    // Buscar candidato por email
    Optional<Candidato> findByEmail(String email);
    
    // Verificar se já existe um email cadastrado
    boolean existsByEmail(String email);
    
    // Verificar se já existe um CPF cadastrado  
    boolean existsByCpf(String cpf);
}
