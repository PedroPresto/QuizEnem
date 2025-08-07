package controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import dao.QuestaoDAO; // Import o novo DAO
import model.QuestaoGabarito; // Import o novo modelo
import model.RespostaUsuario;
import utils.SimuladoUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/finalizarSimulado")
public class FinalizarSimuladoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession();
        QuestaoDAO questaoDAO = new QuestaoDAO(); // Instancia o DAO

        int[] idsQuestoes = (int[]) sessao.getAttribute("idsQuestoes");
        if (idsQuestoes == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Simulado não iniciado.");
            return;
        }

        Map<Integer, RespostaUsuario> respostasUsuario = SimuladoUtils.getRespostas(request);
        List<QuestaoGabarito> gabaritoDetalhado = new ArrayList<>();

        int acertos = 0;
        int erros = 0;
        int naoRespondidas = 0;

        for (int idQuestao : idsQuestoes) {
            try {
                QuestaoGabarito qg = questaoDAO.findQuestaoCompletaById(idQuestao);
                if (qg == null) continue; // Pula se a questão não for encontrada no DB

                RespostaUsuario respostaUser = respostasUsuario.get(idQuestao);

                if (respostaUser == null || respostaUser.getSelectedAnswer() == null || respostaUser.getSelectedAnswer().isBlank()) {
                    naoRespondidas++;
                    qg.setStatus("nao_respondida");
                    qg.setRespostaUsuario("");
                } else {
                    String respostaCorreta = qg.getRespostaCorreta();
                    String respostaMarcada = respostaUser.getSelectedAnswer();
                    qg.setRespostaUsuario(respostaMarcada);

                    if (respostaMarcada.equalsIgnoreCase(respostaCorreta)) {
                        acertos++;
                        qg.setStatus("correta");
                    } else {
                        erros++;
                        qg.setStatus("incorreta");
                    }
                }
                gabaritoDetalhado.add(qg);

            } catch (SQLException e) {
                Logger.getLogger(FinalizarSimuladoServlet.class.getName()).log(Level.SEVERE, "Erro ao buscar questão ID: " + idQuestao, e);
                // Decide como tratar o erro, talvez pular a questão ou retornar um erro 500
            }
        }

        // --- Monta o JSON de Resposta ---
        JsonObject jsonResponse = new JsonObject();

        // Objeto com as estatísticas detalhadas (para os cards e gráfico)
        JsonObject detalhado = new JsonObject();
        detalhado.addProperty("correct", acertos);
        detalhado.addProperty("incorrect", erros);
        detalhado.addProperty("unanswered", naoRespondidas);
        jsonResponse.add("detalhado", detalhado);

        // Array com o gabarito completo
        // Usar Gson para serializar a lista de objetos QuestaoGabarito
        Gson gson = new GsonBuilder().create();
        jsonResponse.add("gabaritoDetalhado", gson.toJsonTree(gabaritoDetalhado));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonResponse.toString());
    }
}