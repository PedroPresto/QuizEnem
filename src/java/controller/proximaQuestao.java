package controller;

import java.io.IOException;
import config.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import utils.SimuladoUtils;

@WebServlet("/ProximaQuestao")
public class proximaQuestao extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession sessao = request.getSession();

        String indiceParam = request.getParameter("indice");
        int indice;
        if (indiceParam != null) {
            try {
                indice = Integer.parseInt(indiceParam);
            } catch (NumberFormatException e) {
                indice = 0;
            }
        } else {
            // Se não vier o parâmetro, continua com o índice atual armazenado (se houver)
            Integer indiceSessao = (Integer) sessao.getAttribute("indiceAtual");
            indice = (indiceSessao != null) ? indiceSessao + 1 : 0;
        }
        sessao.setAttribute("indiceAtual", indice);
        sessao.setAttribute("questaoAtual", indice); // necessário para script.js


        // Aqui usamos o índice para buscar o id da questão no array armazenado na sessão
        // Supondo que o array de IDs foi gravado como um int[] no início do simulado
        int[] idsQuestoes = (int[]) sessao.getAttribute("idsQuestoes");
        int idQuestao = 1; // valor padrão
        if (idsQuestoes != null && indice >= 0 && indice < idsQuestoes.length) {
            idQuestao = idsQuestoes[indice];
        }
        sessao.setAttribute("idQuestao", idQuestao);

        // Busca a questão do banco, baseado no idQuestao e em materia
        String materia = (String) sessao.getAttribute("materia");
        try {
            proximaQuestao.setEnunciado(request, materia, idQuestao);
            sessao.setAttribute("anexoTexto", getAnexoTexto(idQuestao));
            proximaQuestao.setOpcoes(request, idQuestao);
        } catch (SQLException ex) {
            Logger.getLogger(proximaQuestao.class.getName()).log(Level.SEVERE, null, ex);
        }
        // Atualiza o que for necessário, ex: estatísticas, etc.
        // SimuladoUtils.atualizarQuestaoAtual(request); -> se necessário usar algo semelhante

        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/jsp/simulado1.jsp");
        rd.forward(request, response);
    }

    public static void setEnunciado(HttpServletRequest request, String materia, int questaoID) throws SQLException {
        String sql = "SELECT enunciado FROM " + materia + " WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, questaoID);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    request.getSession().setAttribute("enunciado", rs.getString("enunciado"));
                }
            }
        }
    }

    public String getAnexoTexto(int questaoID) throws SQLException {
        String sql = "SELECT anexo_texto FROM lingua_portuguesa WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, questaoID);
            try (ResultSet rs = st.executeQuery()) {
                return rs.next() ? rs.getString("anexo_texto") : "Desculpe, esse conteúdo está indisponível no momento";
            }
        }
    }

    public static void setOpcoes(HttpServletRequest request, int idQuestao) throws SQLException {
        String sql = "SELECT escolha_a, escolha_b, escolha_c, escolha_d, escolha_e, resposta_correta FROM lingua_portuguesa WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    HttpSession sessao = request.getSession();
                    sessao.setAttribute("opcaoA", rs.getString("escolha_a"));
                    sessao.setAttribute("opcaoB", rs.getString("escolha_b"));
                    sessao.setAttribute("opcaoC", rs.getString("escolha_c"));
                    sessao.setAttribute("opcaoD", rs.getString("escolha_d"));
                    sessao.setAttribute("opcaoE", rs.getString("escolha_e"));
                    sessao.setAttribute("opcaoCorreta", rs.getString("resposta_correta"));
                }
            }
        }
    }
}
