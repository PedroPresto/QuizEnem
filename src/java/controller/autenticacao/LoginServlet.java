package controller.autenticacao; // ← atualizado!

import com.google.gson.JsonObject;
import dao.UsuarioDAO;
import java.io.Console;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import model.Usuario;
import utils.AuthHelper;

@WebServlet("/login") // URL que o formulário de login envia o POST
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        System.out.println("Email recebido: " + email);
        System.out.println("Senha recebida: " + senha);
        System.out.println("1");
        
        AuthHelper.autenticarUsuario(request, response, email, senha);
    }
}
