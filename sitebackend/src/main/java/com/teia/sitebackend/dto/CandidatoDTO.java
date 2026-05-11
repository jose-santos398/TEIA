package com.teia.sitebackend.dto;

/**
 * DTO para resposta de Candidato (não expõe senha)
 */
public class CandidatoDTO {
    private String candidato_id;
    private String nome;
    private String cpf;
    private String email;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private String curriculoNomeArquivo;
    private boolean possuiCurriculo;

    public CandidatoDTO() {
    }

    public CandidatoDTO(String candidato_id, String nome, String cpf, String email) {
        this.candidato_id = candidato_id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
    }

    public String getCandidato_id() {
        return candidato_id;
    }

    public void setCandidato_id(String candidato_id) {
        this.candidato_id = candidato_id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCurriculoNomeArquivo() {
        return curriculoNomeArquivo;
    }

    public void setCurriculoNomeArquivo(String curriculoNomeArquivo) {
        this.curriculoNomeArquivo = curriculoNomeArquivo;
    }

    public boolean isPossuiCurriculo() {
        return possuiCurriculo;
    }

    public void setPossuiCurriculo(boolean possuiCurriculo) {
        this.possuiCurriculo = possuiCurriculo;
    }
}
