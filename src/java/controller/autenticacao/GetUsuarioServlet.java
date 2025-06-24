package controller.autenticacao;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/usuario-info")
public class GetUsuarioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession sessao = request.getSession(false);
        
        Usuario usuarioLogado = (Usuario) sessao.getAttribute("usuarioLogado");
       
        System.out.println("usuario logado: " + usuarioLogado);
        JsonObject json = new JsonObject();

        if (usuarioLogado != null) {
            Gson gson = new Gson();
            JsonElement usuarioJson = gson.toJsonTree(usuarioLogado);
            json.addProperty("status", "ok");
            json.add("usuarioLogado", usuarioJson);
        } else {
            json.addProperty("status", "erro");
            json.addProperty("mensagem", "Usuário não autenticado.");
        }

        response.getWriter().write(json.toString());

    }
}
