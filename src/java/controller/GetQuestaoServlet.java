package controller;

import com.google.gson.JsonObject;
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
import java.io.PrintWriter;
import java.io.StringWriter;
import javax.servlet.http.HttpServletResponseWrapper;
import model.Usuario;

@WebServlet("/getQuestao")
public class GetQuestaoServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession();
        Usuario usuario = (Usuario) sessao.getAttribute("usuarioLogado");

        //String materia = request.getParameter("materia");
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

        String nomeMateria = "enem";
        sessao.setAttribute("idQuestaoAdmin", idQuestao);

        try {
            nomeMateria = getNomeMateriaDaQuestao(idQuestao);
        } catch (SQLException ex) {
            Logger.getLogger(GetQuestaoServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
        request.getSession().setAttribute("materiaFront", nomeMateria);
        sessao.setAttribute("idQuestao", idQuestao);

        try {
            setEnunciado(request, idQuestao);
            setOpcoes(request, idQuestao);
            adminFeedback(request, idQuestao);
            sessao.setAttribute("anexoTexto", getAnexoTexto(idQuestao));
            sessao.setAttribute("comentarioQuestao", getComentarioQuestao(idQuestao));

            String anexoImagem = getAnexoImagem(idQuestao);
            sessao.setAttribute("anexoImagem", anexoImagem);

        } catch (SQLException ex) {
            Logger.getLogger(proximaQuestao.class.getName()).log(Level.SEVERE, null, ex);
        }

        request.setAttribute("indice", indice);
        int numeroQuestao = 0;
        String materialQuestao = "n/a";
        
       // if (usuario.isAdmin()) {
            Object atributoNumeroQuestao = sessao.getAttribute("numeroQuestao");
            
            if (atributoNumeroQuestao != null) {
                numeroQuestao = Integer.parseInt(atributoNumeroQuestao.toString());
                materialQuestao = sessao.getAttribute("materialQuestao").toString();
                
            }
      //  }

        StringWriter sw = new StringWriter();
        HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response) {
            @Override
            public PrintWriter getWriter() {
                return new PrintWriter(sw);
            }
        };

        RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/jsp/questionCard.jsp");
        dispatcher.include(request, responseWrapper);

        String htmlDaQuestao = sw.toString();

        JsonObject json = new JsonObject();
        json.addProperty("html", htmlDaQuestao);
        json.addProperty("materia", nomeMateria);
        json.addProperty("idQuestao", idQuestao);
        json.addProperty("numeroQuestao", numeroQuestao);
        json.addProperty("materialQuestao", materialQuestao);

        String anexoImagemJson = (String) sessao.getAttribute("anexoImagem");
        json.addProperty("anexoImagem", anexoImagemJson);

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(json.toString());

    }

    public static void setEnunciado(HttpServletRequest request, int idQuestao) throws SQLException {
        String sql = "SELECT enunciado FROM questoes WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            //st.setInt(2, idMateria);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    request.getSession().setAttribute("enunciado", rs.getString("enunciado"));
                }
            }
        }
    }

    public String getAnexoTexto(int idQuestao) throws SQLException {
        String sql = "SELECT anexo_texto FROM questoes WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);

            try (ResultSet rs = st.executeQuery()) {
                return rs.next() ? rs.getString("anexo_texto") : "Desculpe, esse conteúdo está indisponível no momento";
            }
        }
    }

    public String getAnexoImagem(int idQuestao) throws SQLException {
        String sql = "SELECT anexo_imagem FROM questoes WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            try (ResultSet rs = st.executeQuery()) {
                // Retorna o caminho da imagem se encontrar, senão retorna null
                return rs.next() ? rs.getString("anexo_imagem") : null;
            }
        }
    }

    public String getComentarioQuestao(int idQuestao) throws SQLException {
        String sql = "SELECT comentario FROM questoes WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);

            try (ResultSet rs = st.executeQuery()) {
                return rs.next() ? rs.getString("comentario") : "Desculpe, esse conteúdo está indisponível no momento";
            }
        }
    }

    public static void setOpcoes(HttpServletRequest request, int idQuestao) throws SQLException {
        String sql = "SELECT escolha_a, escolha_b, escolha_c, escolha_d, escolha_e, resposta_correta FROM questoes WHERE id = ?";
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

    //formata o nome da materia no banco de dados para o Front
    public static String getNomeMateriaDaQuestao(int idQuestao) throws SQLException {
        String sql = "SELECT m.materia FROM questoes q JOIN materias m ON q.id_materia = m.id WHERE q.id = ?";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setInt(1, idQuestao);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("materia");
                }
            }
        }
        return "enem"; // padrão caso não encontre
    }
    
    public static void adminFeedback(HttpServletRequest request, int idQuestao) throws SQLException {
        String sql = "SELECT numero, material FROM questoes WHERE id = ?";
        try (Connection conecta = DBConnection.getConnection(); PreparedStatement st = conecta.prepareStatement(sql)) {
            st.setInt(1, idQuestao);

            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    HttpSession sessao = request.getSession();
                    sessao.setAttribute("numeroQuestao", rs.getString("numero"));
                    sessao.setAttribute("materialQuestao", rs.getString("material"));
                }
            }
        }
    }

}
