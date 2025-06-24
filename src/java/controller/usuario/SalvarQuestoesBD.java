package controller.usuario;

import com.google.gson.Gson;
import config.DBConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;
import model.RespostaUsuario;
import utils.SimuladoUtils;

@WebServlet("/salvarQuestoesBD")
public class SalvarQuestoesBD extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Integer idUsuario = (Integer) request.getSession().getAttribute("idUsuario");
        if (idUsuario == null) {
            response.setStatus(401);
            response.getWriter().write("Usuário não autenticado.");
            return;
        }

        Map<Integer, RespostaUsuario> respostas = SimuladoUtils.getRespostas(request);
        if (respostas == null || respostas.isEmpty()) {
            response.setStatus(400);
            response.getWriter().write("Nenhuma resposta encontrada na sessão.");
            return;
        }

        Set<Integer> idsRespondidos = respostas.keySet();
        Set<Integer> idsValidos = new HashSet<>();

        try (Connection conn = DBConnection.getConnection()) {
            // 🔍 Valida apenas os IDs recebidos
            String placeholders = idsRespondidos.stream().map(id -> "?").collect(Collectors.joining(","));
            String sqlCheck = "SELECT id FROM questoes WHERE id IN (" + placeholders + ")";
            PreparedStatement checkStmt = conn.prepareStatement(sqlCheck);

            int index = 1;
            for (Integer id : idsRespondidos) {
                checkStmt.setInt(index++, id);
            }

            ResultSet rs = checkStmt.executeQuery();
            while (rs.next()) {
                idsValidos.add(rs.getInt("id"));
            }

            // 🚀 Insere apenas os válidos
            String sqlInsert = """
    INSERT INTO respostas_usuario (id_usuario, id_questao, resposta_marcada, status_resposta)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    resposta_marcada = VALUES(resposta_marcada),
    status_resposta = VALUES(status_resposta)
""";
            PreparedStatement insertStmt = conn.prepareStatement(sqlInsert);

            for (Map.Entry<Integer, RespostaUsuario> entry : respostas.entrySet()) {
                int idQuestao = entry.getKey();
                if (!idsValidos.contains(idQuestao)) {
                    continue;
                }

                insertStmt.setInt(1, idUsuario);
                insertStmt.setInt(2, idQuestao);
                insertStmt.setString(3, entry.getValue().getSelectedAnswer());
                insertStmt.setInt(4, entry.getValue().getStatus());
                insertStmt.addBatch();
            }

            insertStmt.executeBatch();
        } catch (SQLException e) {
            response.setStatus(500);
            response.getWriter().write("Erro ao salvar respostas no banco.");
            return;
        }

        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(Map.of("status", "ok")));
    }
}
