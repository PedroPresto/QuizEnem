package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import utils.SimuladoUtils;
import model.RespostaUsuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;

@WebServlet("/salvarResposta")
public class SalvarRespostaServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        BufferedReader reader = request.getReader();
        Gson gson = new Gson();
        JsonObject json = gson.fromJson(reader, JsonObject.class);

        int questaoIndice = json.get("questao").getAsInt(); // índice 0 a x
     
        int[] idsQuestoes = (int[]) request.getSession().getAttribute("idsQuestoes");
        int idQuestao = idsQuestoes[questaoIndice];
        
        String resposta = json.get("resposta").getAsString();

        int novoStatus = 1; // default: selecionado

        if (json.has("somenteSelecionou") && json.get("somenteSelecionou").getAsBoolean()) {
            novoStatus = 1;
        } else if (json.has("correta")) {
            boolean correta = json.get("correta").getAsBoolean();
            novoStatus = correta ? 2 : 3;
        }

        Map<Integer, RespostaUsuario> respostas = SimuladoUtils.getRespostas(request);
        RespostaUsuario anterior = respostas.get(idQuestao);

        // Proteção: não sobrescreve correct/incorrect por selected
        if (anterior != null) {
            int statusAnterior = anterior.getStatus();
            if ((statusAnterior == 2 || statusAnterior == 3) && novoStatus == 1) {
                // já está correta ou errada, não sobrescreve com "selected"
                novoStatus = statusAnterior;
            }
        }

        SimuladoUtils.atualizarResposta(request, idQuestao, resposta, novoStatus);

        JsonObject retorno = new JsonObject();
        retorno.addProperty("resposta", resposta);
        retorno.addProperty("status", switch (novoStatus) {
            case 2 ->
                "correct";
            case 3 ->
                "incorrect";
            case 1 ->
                "selected";
            default ->
                "unanswered";
        });

        response.setContentType("application/json");
        response.getWriter().write(retorno.toString());
    }
}
