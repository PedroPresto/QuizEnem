package utils;

import com.google.gson.JsonObject;
import dao.UsuarioDAO;
import model.Usuario;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

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

    private static String gerarIniciais(String nome) {
        if (nome == null || nome.isEmpty()) return "?";
        String[] partes = nome.trim().split("\\s+");
        return Arrays.stream(partes)
                .limit(2)
                .map(p -> p.substring(0, 1).toUpperCase())
                .collect(Collectors.joining());
    }


    public static void autenticarUsuario(HttpServletRequest request, HttpServletResponse response,
            String email, String senha) throws IOException {

        UsuarioDAO usuarioDAO = new UsuarioDAO();
        Usuario usuarioLogado = usuarioDAO.autenticar(email, senha);
        System.out.println(gerarIniciais(usuarioLogado.getNome()));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject resultado = new JsonObject();

        if (usuarioLogado != null) {
            HttpSession sessao = request.getSession();
            usuarioLogado.setIniciais(gerarIniciais(usuarioLogado.getNome()));
            sessao.setAttribute("usuarioLogado", usuarioLogado);
            sessao.setAttribute("idUsuario", usuarioLogado.getId());
            resultado.addProperty("status", "ok");
            resultado.addProperty("nome", usuarioLogado.getNome());
            sessao.setAttribute("foto", usuarioLogado.getFoto());
            resultado.addProperty("isadmin", usuarioLogado.isAdmin());
            resultado.addProperty("ispremium", usuarioLogado.isPremium());
            resultado.addProperty("iniciais", usuarioLogado.getIniciais());
        } else {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Ops! Parece que o e-mail ou a senha estão incorretos.");
        }

        response.getWriter().print(resultado.toString());
        response.getWriter().flush();
    }
}
