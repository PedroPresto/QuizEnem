// Lembre-se de ajustar o nome do pacote se for diferente
package controller.api;

import com.google.gson.Gson;
import dao.UsuarioDAO;
import model.Usuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Servlet que funciona como uma API para fornecer uma lista de todos os usuários em formato JSON.
 * Requer uma Chave de API para acesso e está configurado para permitir requisições
 * do ambiente de desenvolvimento React (CORS).
 */
@WebServlet("/api/usuarios")
public class UsuariosApiServlet extends HttpServlet {

    /**
     * A Chave de API secreta que o servidor espera.
     * A forma mais segura de gerir esta chave é através de variáveis de ambiente.
     * O seu docker-compose.yml passa o valor do Secret do GitHub para esta variável.
     */
    private static final String CHAVE_SECRETA_ESPERADA = "a7b9f3e1-d4c2-4a8e-b1f6-9c7d8a2b5e4f-quiz-enem";

    /**
     * Lida com as requisições "preflight" (sondagem) OPTIONS enviadas pelos navegadores
     * para verificar as permissões de CORS antes de enviar a requisição real (GET).
     * É essencial para requisições com cabeçalhos customizados como o nosso 'X-API-Key'.
     */
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Permite requisições da origem do seu servidor de desenvolvimento React
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        // Permite os métodos HTTP que a sua API vai usar
        resp.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        // Permite os cabeçalhos necessários para a requisição
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
        // Responde com status OK para indicar que a sondagem foi bem-sucedida
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    /**
     * Lida com as requisições GET para buscar e retornar a lista de usuários.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Pega a chave que o cliente (React) enviou no cabeçalho da requisição
        String chaveEnviada = request.getHeader("X-API-Key");

        // 1. VERIFICAÇÃO DE SEGURANÇA
        // Se a chave não foi enviada ou se é diferente da esperada, bloqueia o acesso.
        if (CHAVE_SECRETA_ESPERADA == null || !CHAVE_SECRETA_ESPERADA.equals(chaveEnviada)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Erro 403 Forbidden
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"erro\": \"Acesso nao autorizado. Chave de API invalida ou ausente.\"}");
            return; // Para a execução do método aqui
        }

        // 2. CONFIGURAÇÃO DE CORS PARA A RESPOSTA REAL
        // Permite que o navegador do cliente leia a resposta
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

        // 3. LÓGICA DE NEGÓCIO
        try {
            // Instancia o DAO para buscar os dados
            UsuarioDAO usuarioDAO = new UsuarioDAO();
            List<Usuario> usuarios = usuarioDAO.listarTodos();

            // Instancia o Gson para converter a lista para JSON
            Gson gson = new Gson();
            String jsonUsuarios = gson.toJson(usuarios);

            // Prepara a resposta
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // Envia o JSON como resposta
            response.getWriter().write(jsonUsuarios);

        } catch (Exception e) {
            // Em caso de erro no servidor (ex: falha de conexão com o banco), envia uma resposta de erro
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // Erro 500
            response.getWriter().write("{\"erro\": \"Nao foi possivel buscar os usuarios devido a um erro interno.\"}");
            e.printStackTrace(); // Imprime o erro no log do servidor para depuração
        }
    }
}