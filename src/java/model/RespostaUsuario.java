package model;

import java.io.Serializable;

public class RespostaUsuario implements Serializable {
    private int idQuestao; // índice da questão (posição no array: 0 a 9)
    private String selectedAnswer; // a resposta que o usuário selecionou
    private int status; // 1: selecionou, não checou; 2: checou e acertou; 3: checou e errou; 4: não respondeu

    public RespostaUsuario() {}

    public RespostaUsuario(int idQuestao, String selectedAnswer, int status) {
        this.idQuestao = idQuestao;
        this.selectedAnswer = selectedAnswer;
        this.status = status;
    }

    // Getters e Setters
    public int getIdQuestao() {
        return idQuestao;
    }
    public void setIdQuestao(int indiceQuestao) {
        this.idQuestao = indiceQuestao;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }
    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}
