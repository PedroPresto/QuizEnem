package controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import config.DBConnection; // Import necessário

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/getIdsQuestoes")
public class GetIdsQuestoesServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        java.lang.reflect.Type listType = new TypeToken<List<MateriaQuantidade>>() {
        }.getType();
        List<MateriaQuantidade> materias = gson.fromJson(request.getReader(), listType);

        Map<Integer, List<Integer>> resultado = new HashMap<>();

        try (Connection conn = DBConnection.getConnection()) {
            for (MateriaQuantidade item : materias) {
                List<Integer> ids = new ArrayList<>();

                String sql;
                // Correção: Verifica se o ano é a string "aleatorio"
                boolean isAnoAleatorio = "aleatorio".equalsIgnoreCase(item.ano);

                if (isAnoAleatorio) {
                    // Se o ano for "aleatorio", a SQL não filtra por ano
                    sql = "SELECT id FROM questoes WHERE id_materia = ?";
                } else {
                    // Se o ano for um valor específico, filtra por id_materia e ano
                    // A coluna 'ano' na tabela 'questoes' deve se relacionar com a tabela 'ano'
                    sql = "SELECT q.id FROM questoes q JOIN ano a ON q.id_ano = a.id WHERE q.id_materia = ? AND a.ano = ?";
                }

                try (PreparedStatement st = conn.prepareStatement(sql)) {
                    st.setInt(1, item.id);
                    // Correção: Só tenta fazer parse e setar o segundo parâmetro se não for aleatório
                    if (!isAnoAleatorio) {
                        try {
                            st.setInt(2, Integer.parseInt(item.ano));
                        } catch (NumberFormatException e) {
                            // Logar erro e enviar resposta de erro ao cliente
                            System.err.println("Erro: Ano recebido não é 'aleatorio' e não é um número válido: " + item.ano);
                            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Ano inválido para a matéria " + item.id);
                            return; // Interrompe o processamento para esta requisição
                        }
                    }
                    try (ResultSet rs = st.executeQuery()) {
                        while (rs.next()) {
                            ids.add(rs.getInt("id"));
                        }
                    }
                }

                // embaralha
                Collections.shuffle(ids);
                // seleciona a quantidade solicitada
                int qntd = Math.min(item.quantidade, ids.size());
                resultado.put(item.id, ids.subList(0, qntd));
            }
        } catch (SQLException e) {
            System.err.println("Erro no banco ao buscar IDs de questões: " + e.getMessage());
            e.printStackTrace(); // Para depuração
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro no banco de dados.");
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8"); // Garante que a resposta JSON seja UTF-8
        response.getWriter().write(gson.toJson(resultado));
    }

    private static class MateriaQuantidade {
        String ano; // Continua sendo String para aceitar "aleatorio"
        int id;
        int quantidade;
    }
}