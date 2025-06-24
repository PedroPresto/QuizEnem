
package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/getMateriaAtual")
public class GetMateriaAtualServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String materia = (String) request.getSession().getAttribute("materiaFront");
        if (materia == null) {
            materia = "Matéria";
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"materia\":\"" + materia + "\"}");
    }
}

