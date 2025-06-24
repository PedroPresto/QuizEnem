package controller;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonObject;



@WebServlet("/getOpcaoCorreta")
public class OpcaoCorretaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Exemplo: suponha que você já obteve a opção correta, talvez da sessão ou do banco
        HttpSession sessao = request.getSession();
        String opcaoCorreta = (String) sessao.getAttribute("opcaoCorreta");
        if(opcaoCorreta == null){
            opcaoCorreta = "b"; // valor padrão ou faça a consulta no banco se necessário
        }
        
        // Configura o content type para JSON
        response.setContentType("application/json");
        // Cria o JSON com Gson
        JsonObject json = new JsonObject();
        json.addProperty("opcaoCorreta", opcaoCorreta);
        
        // Envia a resposta
        response.getWriter().print(json.toString());
        response.getWriter().flush();
    }
}
