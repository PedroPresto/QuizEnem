/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package config;

import java.io.IOException;
import java.util.Enumeration;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.google.gson.JsonObject;

@WebServlet("/debugSessao")
public class DebugServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json; charset=UTF-8");
        HttpSession sessao = request.getSession(false);
        JsonObject json = new JsonObject();

        if (sessao == null) {
            json.addProperty("erro", "Sessão inexistente");
        } else {
            Enumeration<String> nomes = sessao.getAttributeNames();

            if (!nomes.hasMoreElements()) {
                json.addProperty("mensagem", "Nenhum atributo encontrado na sessão.");
            } else {
                while (nomes.hasMoreElements()) {
                    String nome = nomes.nextElement();
                    Object valor = sessao.getAttribute(nome);

                    // Para simplificação, vamos apenas usar toString().
                    json.addProperty(nome, String.valueOf(valor));
                }
            }
        }

        response.getWriter().print(json.toString());
    }
}
