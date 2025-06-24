package controller.estatisticas;

import com.google.gson.Gson;
import dao.EstatisticasDAO;
import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Estatisticas;
import model.Usuario;

@WebServlet("/estatisticas-json")
public class EstatisticasJson extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession(false);
        Usuario usuario = (Usuario) sessao.getAttribute("usuarioLogado");

        if (usuario == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"erro\": \"Usuário não autenticado.\"}");
            return;
        }

        try {
            Estatisticas estat = EstatisticasDAO.getEstatisticas(usuario.getId());

            String json = new Gson().toJson(estat);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"erro\": \"Erro ao carregar estatísticas.\"}");
            e.printStackTrace(); // opcional: log com Logger
        }
    }
}
