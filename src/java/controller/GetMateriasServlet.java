package controller;

import com.google.gson.Gson;
import config.DBConnection;
import model.Materia; // Assumindo que você tem um modelo Materia com id, nome e, opcionalmente, icon

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/getMaterias")
public class GetMateriasServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();
        List<Materia> materias = new ArrayList<>();

        // Assumindo que você tem uma tabela 'materias' com colunas 'id', 'nome' e, opcionalmente, 'icon'
        String sql = "SELECT id, materia FROM materias ORDER BY materia";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(sql);
             ResultSet rs = st.executeQuery()) {

            while (rs.next()) {
                Materia materia = new Materia();
                materia.setId(rs.getInt("id"));
                materia.setNome(rs.getString("materia"));
                materias.add(materia);
            }

        } catch (SQLException e) {
            Logger.getLogger(GetMateriasServlet.class.getName()).log(Level.SEVERE, "Erro ao buscar matérias", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao carregar matérias do banco de dados.");
            return;
        }

        response.getWriter().write(gson.toJson(materias));
    }
}
