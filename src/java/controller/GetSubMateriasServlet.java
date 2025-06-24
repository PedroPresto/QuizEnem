package controller;

import com.google.gson.Gson;
import dao.SubMateriaDAO;
import model.SubMateria;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/getSubMaterias")
public class GetSubMateriasServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String idMateriaParam = request.getParameter("idMateria");
        if (idMateriaParam == null || idMateriaParam.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID da matéria ausente.");
            return;
        }

        int idMateria;
        try {
            idMateria = Integer.parseInt(idMateriaParam);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID da matéria inválido.");
            return;
        }

        SubMateriaDAO subMateriaDAO = new SubMateriaDAO();
        try {
            List<SubMateria> subMaterias = subMateriaDAO.getSubMateriasByMateriaId(idMateria);
            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(subMaterias));

        } catch (SQLException e) {
            Logger.getLogger(GetSubMateriasServlet.class.getName()).log(Level.SEVERE, "Erro ao buscar sub-matérias", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao carregar sub-matérias do banco de dados.");
        }
    }
}