package controller.filter;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Usuario;

@WebFilter(urlPatterns = {"/admins/*"})
public class AdminOnlyFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        HttpSession sessao = req.getSession(false);

        Usuario usuario = (sessao != null) ? (Usuario) sessao.getAttribute("usuarioLogado") : null;

        boolean autorizado = (usuario != null && usuario.isAdmin());

        if (autorizado) {
            chain.doFilter(request, response);
        } else {
            resp.sendRedirect(req.getContextPath() + "/autenticacao/login.jsp");
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Pode deixar vazio se não tiver nada pra inicializar
    }

    @Override
    public void destroy() {
        // Pode deixar vazio também
    }
}
