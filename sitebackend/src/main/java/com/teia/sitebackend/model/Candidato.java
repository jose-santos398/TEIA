package com.teia.sitebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Document(collection = "candidatos")
public class Candidato {
    @Id
    private String candidato_id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos numéricos")
    @Indexed(unique = true)
    private String cpf;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Indexed(unique = true)
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 50, message = "Senha deve ter entre 6 e 50 caracteres")
    private String senha;

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "CEP deve conter exatamente 8 dígitos numéricos")
    private String cep;

    @NotBlank(message = "Logradouro é obrigatório")
    @Size(min = 3, max = 120, message = "Logradouro deve ter entre 3 e 120 caracteres")
    private String logradouro;

    @NotBlank(message = "Número é obrigatório")
    @Size(min = 1, max = 20, message = "Número deve ter entre 1 e 20 caracteres")
    private String numero;

    @Size(max = 120, message = "Complemento deve ter no máximo 120 caracteres")
    private String complemento;

    @NotBlank(message = "Bairro é obrigatório")
    @Size(min = 2, max = 80, message = "Bairro deve ter entre 2 e 80 caracteres")
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Size(min = 2, max = 80, message = "Cidade deve ter entre 2 e 80 caracteres")
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Pattern(regexp = "[A-Za-z]{2}", message = "Estado deve conter a sigla com 2 letras")
    private String estado;

    private String curriculoNomeArquivo;

    private String curriculoContentType;

    private byte[] curriculoArquivo;

    public Candidato() {
    }

    public Candidato(String candidato_id, String cpf, String email, String nome, String senha) {
        this.candidato_id = candidato_id;
        this.cpf = cpf;
        this.email = email;
        this.nome = nome;
        this.senha = senha;
    }

    public String getCandidato_id() {
        return candidato_id;
    }

    public void setCandidato_id(String candidato_id) {
        this.candidato_id = candidato_id;
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
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

    public String getCurriculoContentType() {
        return curriculoContentType;
    }

    public void setCurriculoContentType(String curriculoContentType) {
        this.curriculoContentType = curriculoContentType;
    }

    public byte[] getCurriculoArquivo() {
        return curriculoArquivo;
    }

    public void setCurriculoArquivo(byte[] curriculoArquivo) {
        this.curriculoArquivo = curriculoArquivo;
    }
}
