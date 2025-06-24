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

@WebServlet("/getQuestaoStatus")
public class QuestaoStatusServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        Map<Integer, RespostaUsuario> respostas = SimuladoUtils.getRespostas(request);

        String[] status = new String[10];
        for (int i = 0; i < status.length; i++) {
            RespostaUsuario r = respostas.get(i);
            if (r != null) {
                int s = r.getStatus();
                status[i] = switch (s) {
                    case 2 -> "correct";
                    case 3 -> "incorrect";
                    case 1 -> "selected";
                    default -> "unanswered";
                };
            } else {
                status[i] = "unanswered";
            }
        }

        JsonObject json = new JsonObject();
        json.add("status", new Gson().toJsonTree(status));

        response.setContentType("application/json");
        response.getWriter().write(json.toString());
    }
}
