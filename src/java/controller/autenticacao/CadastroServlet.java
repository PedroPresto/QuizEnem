package controller.autenticacao;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import dao.UsuarioDAO;
import model.Usuario;
import com.google.gson.JsonObject;
import utils.AuthHelper;

@WebServlet("/cadastro")
public class CadastroServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // Método POST - recebe o formulário de cadastro
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Pega os parâmetros do formulário
        String nome = request.getParameter("nome");
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        String confirmarSenha = request.getParameter("confirmarSenha");
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject resultado = new JsonObject();

        // Segurança: validar no backend também
        if (nome == null || email == null || senha == null || confirmarSenha == null ||
            nome.isEmpty() || email.isEmpty() || senha.isEmpty() || confirmarSenha.isEmpty()) {

            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Preencha todos os campos.");
            out.print(resultado.toString());
            return;
        }

        if (!senha.equals(confirmarSenha)) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Senhas não conferem.");
            out.print(resultado.toString());
            return;
        }

        UsuarioDAO usuarioDAO = new UsuarioDAO();

        try {
            // Verifica se já existe email cadastrado
            if (usuarioDAO.existeEmail(email)) {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Este e-mail já está cadastrado.");
                out.print(resultado.toString());
                return;
            }
            // Cria o usuário
            Usuario novoUsuario = new Usuario(nome, email, senha);
            usuarioDAO.cadastrar(novoUsuario);
            
            AuthHelper.autenticarUsuario(request, response, email, senha);

        } catch (SQLException e) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Erro interno no servidor, tente novamente mais tarde.");
            out.print(resultado.toString());
        }
    }
}
