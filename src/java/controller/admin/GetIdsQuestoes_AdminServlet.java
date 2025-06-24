package controller.admin;

import com.google.gson.Gson;
import config.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/getQuestoesPorIdInicial")
public class GetIdsQuestoes_AdminServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Lê o parâmetro enviado no corpo da requisição
        String idInicioStr = request.getParameter("idInicio");

        if (idInicioStr == null || idInicioStr.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inicial não informado.");
            return;
        }

        int idInicio;
        try {
            idInicio = Integer.parseInt(idInicioStr);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inicial inválido.");
            return;
        }

        List<Integer> ids = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT id FROM questoes WHERE id >= ? ORDER BY id ASC";
            try (PreparedStatement st = conn.prepareStatement(sql)) {
                st.setInt(1, idInicio);
                try (ResultSet rs = st.executeQuery()) {
                    while (rs.next()) {
                        ids.add(rs.getInt("id"));
                    }
                }
            }
        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao consultar o banco de dados.");
            return;
        }

        // Envia os IDs em formato JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(ids));
    }
}
