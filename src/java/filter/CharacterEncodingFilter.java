package filter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

/**
 * Este filtro garante que todas as requisições e respostas
 * usem a codificação de caracteres UTF-8.
 * Isto resolve problemas com acentuação ao ser partilhado em redes sociais.
 */
@WebFilter("/*")
public class CharacterEncodingFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Nada a inicializar
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Força a codificação UTF-8 para todas as requisições
        request.setCharacterEncoding("UTF-8");

        // Força a codificação UTF-8 para todas as respostas
        response.setCharacterEncoding("UTF-8");

        // Continua o processamento normal da requisição
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Nada a destruir
    }
}
