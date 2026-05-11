package com.teia.sitebackend.dto;

import java.util.List;

public class CurriculoAnaliseResponse {

    private String nomeArquivo;
    private String resumo;
    private List<String> pontosFortes;
    private List<String> pontosMelhoria;
    private String mensagemFinal;

    public CurriculoAnaliseResponse() {
    }

    public CurriculoAnaliseResponse(
        String nomeArquivo,
        String resumo,
        List<String> pontosFortes,
        List<String> pontosMelhoria,
        String mensagemFinal
    ) {
        this.nomeArquivo = nomeArquivo;
        this.resumo = resumo;
        this.pontosFortes = pontosFortes;
        this.pontosMelhoria = pontosMelhoria;
        this.mensagemFinal = mensagemFinal;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }

    public List<String> getPontosFortes() {
        return pontosFortes;
    }

    public void setPontosFortes(List<String> pontosFortes) {
        this.pontosFortes = pontosFortes;
    }

    public List<String> getPontosMelhoria() {
        return pontosMelhoria;
    }

    public void setPontosMelhoria(List<String> pontosMelhoria) {
        this.pontosMelhoria = pontosMelhoria;
    }

    public String getMensagemFinal() {
        return mensagemFinal;
    }

    public void setMensagemFinal(String mensagemFinal) {
        this.mensagemFinal = mensagemFinal;
    }
}
