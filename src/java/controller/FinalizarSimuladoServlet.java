package controller;

import com.google.gson.JsonObject;
import utils.SimuladoUtils;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import config.BancoDeQuestoes;
import java.util.Enumeration;
import model.RespostaUsuario;

@WebServlet("/finalizarSimulado")
public class FinalizarSimuladoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession();
       
        //debug
        System.out.println("ENCERAR SIMULADO SERVLET");
        if (sessao != null) {
            Enumeration<String> nomes = sessao.getAttributeNames();
            while (nomes.hasMoreElements()) {
                String nome = nomes.nextElement(); 
                
                System.out.println("Atributo na sessão: " + nome);
            }
        }
        // Recupera os IDs das questões do simulado
        int[] idsQuestoes = (int[]) sessao.getAttribute("idsQuestoes");
        //int totalQuestoes = (idsQuestoes != null) ? idsQuestoes.length : 0;

        Map<Integer, RespostaUsuario> respostas = SimuladoUtils.getRespostas(request);

        for (Map.Entry<Integer, RespostaUsuario> entry : respostas.entrySet()) {
            RespostaUsuario r = entry.getValue();

            if (r.getStatus() == 1) { // apenas "selected", nunca checado
                int idQuestao = entry.getKey();
                String respostaUsuario = r.getSelectedAnswer();

                // Aqui você precisa buscar a resposta correta no banco
                String respostaCorreta = BancoDeQuestoes.getGabarito(idQuestao); // <-- você pode implementar isso no DAO

                int novoStatus = respostaUsuario.equalsIgnoreCase(respostaCorreta) ? 2 : 3;
                r.setStatus(novoStatus);
            }
        }

        int respondidas = 0;
        int naoRespondidas = 0;
        Map<String, Integer> detalhado = new HashMap<>();

        // Conta acertos, erros, selecionadas e não respondidas
        for (int id : idsQuestoes) {
            RespostaUsuario r = respostas.get(id);

            String status;
            if (r == null || r.getStatus() == 4) {
                status = "unanswered";
                naoRespondidas++;
            } else {
                status = mapStatus(r.getStatus());
                respondidas++;
            }

            detalhado.put(status, detalhado.getOrDefault(status, 0) + 1);
        }

        // Monta JSON de resposta
        JsonObject json = new JsonObject();
        json.addProperty("respondidas", respondidas);
        json.addProperty("naoRespondidas", naoRespondidas);

        JsonObject detalhadoJson = new JsonObject();
        for (Map.Entry<String, Integer> entry : detalhado.entrySet()) {
            detalhadoJson.addProperty(entry.getKey(), entry.getValue());
        }

        json.add("detalhado", detalhadoJson);

        response.setContentType("application/json");
        response.getWriter().write(json.toString());
    }

    // Converte o status numérico para texto
    private String mapStatus(int code) {
        return switch (code) {
            case 1 ->
                "selected";
            case 2 ->
                "correct";
            case 3 ->
                "incorrect";
            case 4 ->
                "unanswered";
            default ->
                "unknown";
        };
    }
}
