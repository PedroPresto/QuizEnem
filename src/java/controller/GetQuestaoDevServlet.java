package controller;

import java.io.IOException;
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
import config.DBConnection;

@WebServlet("/getQuestaoDev")
public class GetQuestaoDevServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession();

        //String materia = request.getParameter("materia");
        int idMateria = Integer.parseInt(request.getParameter("materia"));
        int idAno = Integer.parseInt(request.getParameter("idAno"));
        
        
        try {
            sessao.setAttribute("materiaFront", setMateriaFront(request, idMateria));
        } catch (SQLException ex) {
            Logger.getLogger(GetQuestaoServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
        int indice = Integer.parseInt(request.getParameter("indice"));
        int questaoAtualFront = indice;
        questaoAtualFront++;

        // Aqui usamos o índice para buscar o id da questão no array armazenado na sessão
        // Supondo que o array de IDs foi gravado como um int[] no início do simulado
        int[] idsQuestoes = (int[]) sessao.getAttribute("idsQuestoes");
        int idQuestao = 1; // valor padrão
        if (idsQuestoes != null && indice >= 0 && indice < idsQuestoes.length) {
            idQuestao = idsQuestoes[indice];
        }
        sessao.setAttribute("questaoAtualFront", questaoAtualFront);
        sessao.setAttribute("idQuestao", idQuestao);

        try {
            setEnunciado(request, idMateria, idQuestao, idAno);
            setOpcoes(request, idMateria, idQuestao);
            sessao.setAttribute("anexoTexto", getAnexoTexto(idMateria, idQuestao));
            sessao.setAttribute("comentarioQuestao", getComentarioQuestao(idMateria, idQuestao));
        } catch (SQLException ex) {
            Logger.getLogger(proximaQuestao.class.getName()).log(Level.SEVERE, null, ex);
        }

        request.setAttribute("indice", indice);
        // Os outros atributos já estão na sessão

        response.setContentType("text/html;charset=UTF-8");
        RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/jsp/questionCard.jsp");
        dispatcher.include(request, response);  // Retorna só a div da questão
    }

    public static void setEnunciado(HttpServletRequest request, int idMateria, int idQuestao, int idAno) throws SQLException {
        String sql = "SELECT enunciado FROM questoes WHERE id = ? AND id_materia = ? AND id_ano = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            st.setInt(2, idMateria);
            st.setInt(3, idAno);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    request.getSession().setAttribute("enunciado", rs.getString("enunciado"));
                }
            }
        }
    }

    public String getAnexoTexto(int idMateria, int idQuestao) throws SQLException {
        String sql = "SELECT anexo_texto FROM questoes WHERE id = ? AND id_materia = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            st.setInt(2, idMateria);
            try (ResultSet rs = st.executeQuery()) {
                return rs.next() ? rs.getString("anexo_texto") : "Desculpe, esse conteúdo está indisponível no momento";
            }
        }
    }
    
    public String getComentarioQuestao(int idMateria, int idQuestao) throws SQLException {
        String sql = "SELECT comentario FROM questoes WHERE id = ? AND id_materia = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            st.setInt(2, idMateria);
            try (ResultSet rs = st.executeQuery()) {
                return rs.next() ? rs.getString("comentario") : "Desculpe, esse conteúdo está indisponível no momento";
            }
        }
    }

    public static void setOpcoes(HttpServletRequest request, int idMateria, int idQuestao) throws SQLException {
        String sql = "SELECT escolha_a, escolha_b, escolha_c, escolha_d, escolha_e, resposta_correta FROM questoes WHERE id = ? AND id_materia = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            st.setInt(2, idMateria);
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

    //formata o nome da materia no banco de dados para o Front
   public static String setMateriaFront(HttpServletRequest request, int idMateria) throws SQLException {
    final String SQL = "SELECT nome FROM materias WHERE id = ?";
    final String DEFAULT_MATERIA = "enem";

    try (Connection conecta = DBConnection.getConnection(); 
         PreparedStatement st = conecta.prepareStatement(SQL)) {
        
        st.setInt(1, idMateria);
        
        try (ResultSet rs = st.executeQuery()) {
            if (rs.next()) {
                String nomeMateria = rs.getString("nome");
                return (nomeMateria != null && !nomeMateria.isEmpty()) ? nomeMateria : DEFAULT_MATERIA;
            }
        }
    }

    return DEFAULT_MATERIA;
}
}