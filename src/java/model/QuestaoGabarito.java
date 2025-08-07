package model;

import java.util.Map;

/**
 * Modelo para transportar os dados completos de uma questão para a página de resultado/gabarito.
 */
public class QuestaoGabarito {

    private int id;
    private String enunciado;
    private String anexoTexto;
    private Map<String, String> alternativas; // Ex: {"A": "Texto da A", "B": "Texto da B", ...}
    private String respostaCorreta; // A letra da resposta correta, ex: "C"
    private String respostaUsuario; // A letra que o usuário marcou, ex: "B"
    private String status; // "correta" ou "incorreta"
    private String comentario;

    // Getters e Setters para todos os campos...

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public String getAnexoTexto() {
        return anexoTexto;
    }

    public void setAnexoTexto(String anexoTexto) {
        this.anexoTexto = anexoTexto;
    }

    public Map<String, String> getAlternativas() {
        return alternativas;
    }

    public void setAlternativas(Map<String, String> alternativas) {
        this.alternativas = alternativas;
    }

    public String getRespostaCorreta() {
        return respostaCorreta;
    }

    public void setRespostaCorreta(String respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }

    public String getRespostaUsuario() {
        return respostaUsuario;
    }

    public void setRespostaUsuario(String respostaUsuario) {
        this.respostaUsuario = respostaUsuario;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}