package controller.usuario;

import config.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/revisao")
public class RevisaoServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        int idUsuario = usuarioLogado.getId();
        List<Map<String, Object>> revisoes = new ArrayList<>();

        String sql = """
            SELECT 
               q.id AS id_questao, 
               q.enunciado, 
               q.anexo_texto,      
               q.escolha_a, q.escolha_b, q.escolha_c, q.escolha_d, q.escolha_e, 
               q.resposta_correta, q.comentario,
               m.materia AS nome_materia,
               a.ano AS ano_questao,
               b.banca AS nome_banca,
               d.dificuldade AS dificuldade_questao,
               r.resposta_marcada, r.status_resposta, 
               ar.nome AS nome_area
             FROM respostas_usuario r
             JOIN questoes q ON r.id_questao = q.id
             JOIN materias m ON q.id_materia = m.id
             JOIN areas ar ON q.id_area = ar.id                     
             LEFT JOIN ano a ON q.id_ano = a.id
             LEFT JOIN banca b ON q.id_banca = b.id
             LEFT JOIN dificuldade d ON q.id_dificuldade = d.id
             WHERE r.id_usuario = ?
             ORDER BY r.data_resposta DESC
             """;

        try (
                Connection conn = DBConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idUsuario);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> questao = new HashMap<>();
                    questao.put("id", rs.getInt("id_questao"));
                    questao.put("enunciado", rs.getString("enunciado"));
                    questao.put("anexo_texto", rs.getString("anexo_texto"));
                    questao.put("a", rs.getString("escolha_a"));
                    questao.put("b", rs.getString("escolha_b"));
                    questao.put("c", rs.getString("escolha_c"));
                    questao.put("d", rs.getString("escolha_d"));
                    questao.put("e", rs.getString("escolha_e"));
                    questao.put("correta", rs.getString("resposta_correta"));
                    questao.put("comentario", rs.getString("comentario"));
                    questao.put("respondida", rs.getString("resposta_marcada"));
                    questao.put("status", rs.getInt("status_resposta"));
                    questao.put("materia", rs.getString("nome_materia"));
                    questao.put("ano", rs.getString("ano_questao"));
                    questao.put("banca", rs.getString("nome_banca"));
                    questao.put("dificuldade", rs.getString("dificuldade_questao"));
                    questao.put("area", rs.getString("nome_area"));

                    revisoes.add(questao);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("Erro ao recuperar dados da revisão.");
            return;
        }

        Set<String> materiasUnicas = new TreeSet<>(); // TreeSet = ordenado
        for (Map<String, Object> questao : revisoes) {
            String materia = (String) questao.get("materia");
            if (materia != null && !materia.isEmpty()) {
                materiasUnicas.add(materia);
            }
        }
        request.setAttribute("materiasUnicas", materiasUnicas);

        Map<String, String> materiaParaArea = new TreeMap<>();
        for (Map<String, Object> questao : revisoes) {
            String materia = (String) questao.get("materia");
            String area = (String) questao.get("area");
            if (materia != null && area != null) {
                materiaParaArea.put(materia, area);
            }
        }
        request.setAttribute("materiaParaArea", materiaParaArea);

        int totalQuestoes = revisoes.size();
        int acertos = 0;
        int erros = 0;

        for (Map<String, Object> questao : revisoes) {
            int status = (int) questao.get("status");
            if (status == 1) {
                acertos++;
            } else if (status == 2) {
                erros++;
            }
            // status == 0 pode ser ignorado ou tratado como "não respondido"
        }

        int taxaAcerto = totalQuestoes > 0 ? (int) ((acertos / (double) totalQuestoes) * 100) : 0;

        request.setAttribute("acertos", acertos);
        request.setAttribute("erros", erros);
        request.setAttribute("totalQuestoes", totalQuestoes);
        request.setAttribute("taxaAcerto", taxaAcerto);

        request.setAttribute("revisoes", revisoes);
        request.getRequestDispatcher("estatisticas/revisao/revisao.jsp").forward(request, response);
    }
}
