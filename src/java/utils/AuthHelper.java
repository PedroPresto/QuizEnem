package utils;

import com.google.gson.JsonObject;
import dao.UsuarioDAO;
import model.Usuario;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class AuthHelper {

  
    //Lógica genérica de colocar o usuário na sessão    
    public static void loginSessao(HttpServletRequest request, Usuario usuarioLogado) {
        HttpSession sessao = request.getSession(true);
        sessao.setAttribute("usuarioLogado", usuarioLogado);
        sessao.setAttribute("idUsuario", usuarioLogado.getId());
        sessao.setAttribute("isadmin", usuarioLogado.isAdmin());
        sessao.setAttribute("ispremium", usuarioLogado.isPremium());
        sessao.setAttribute("foto", usuarioLogado.getFoto());
    }

    public static void autenticarUsuario(HttpServletRequest request, HttpServletResponse response,
            String email, String senha) throws IOException {

        UsuarioDAO usuarioDAO = new UsuarioDAO();
        Usuario usuarioLogado = usuarioDAO.autenticar(email, senha);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject resultado = new JsonObject();

        if (usuarioLogado != null) {
            HttpSession sessao = request.getSession();
            sessao.setAttribute("usuarioLogado", usuarioLogado);
            sessao.setAttribute("idUsuario", usuarioLogado.getId());
            resultado.addProperty("status", "ok");
            resultado.addProperty("nome", usuarioLogado.getNome());
            sessao.setAttribute("foto", usuarioLogado.getFoto());
            resultado.addProperty("isadmin", usuarioLogado.isAdmin());
            resultado.addProperty("ispremium", usuarioLogado.isPremium());
        } else {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Ops! Parece que o e-mail ou a senha estão incorretos.");
        }

        response.getWriter().print(resultado.toString());
        response.getWriter().flush();
    }
}
