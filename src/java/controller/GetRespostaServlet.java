package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import utils.SimuladoUtils;
import model.RespostaUsuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/getResposta")
public class GetRespostaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int questaoIndice = Integer.parseInt(request.getParameter("questao"));
        Map<Integer, RespostaUsuario> respostas = SimuladoUtils.getRespostas(request);

        JsonObject json = new JsonObject();
        RespostaUsuario respostaObj = respostas.get(questaoIndice);

        if (respostaObj != null && respostaObj.getSelectedAnswer() != null && !respostaObj.getSelectedAnswer().isBlank()) {
            json.addProperty("resposta", respostaObj.getSelectedAnswer());

            // Status correto baseado na interação real
            int status = respostaObj.getStatus();
            String statusStr;

            if (status == 2) {
                statusStr = "correct";
            } else if (status == 3) {
                statusStr = "incorrect";
            } else if (status == 1) {
                statusStr = "selected";
            } else {
                statusStr = "unanswered";
            }

            json.addProperty("status", statusStr);
        } else {
            json.addProperty("resposta", "");
            json.addProperty("status", "unanswered");
        }

        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(json));
    }
}
