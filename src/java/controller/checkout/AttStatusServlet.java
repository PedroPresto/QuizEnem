package controller.checkout;

import com.google.gson.JsonObject;
import com.stripe.model.checkout.Session;
import dao.UsuarioDAO;
import model.Usuario;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet("/attstatus")
public class AttStatusServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession(true);
        Usuario usuario = (Usuario) sessao.getAttribute("usuarioLogado");

        if (usuario != null) {
            usuario.setIsPremium(true); // Atualiza o status no próprio objeto           
            sessao.setAttribute("usuarioLogado", usuario);
            sessao.setAttribute("mostrarToast", true); // opcional
            System.out.println("🔥 Sessão atualizada: usuário agora é Premium!");
        }
        response.sendRedirect("index.jsp"); // Vai pra home com sessão atualizada

    }
}
