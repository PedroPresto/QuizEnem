package controller.autenticacao;

import com.google.gson.JsonObject;
import dao.UsuarioDAO;
import model.Usuario;
import utils.AuthHelper;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig; // <-- Importação chave
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

// Habilita o servlet para receber requisições multipart/form-data (uploads)
@MultipartConfig
@WebServlet("/atualizar-perfil")
public class UsuarioAtualizarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject resultado = new JsonObject();

        HttpSession sessao = request.getSession(false);
        if (sessao == null || sessao.getAttribute("usuarioLogado") == null) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Usuário não autenticado. Faça login novamente.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.getWriter().print(resultado.toString());
            return;
        }

        Usuario usuarioLogado = (Usuario) sessao.getAttribute("usuarioLogado");

        // --- Processamento dos campos de texto ---
        String novoNome = request.getParameter("nome");
        String senhaAtual = request.getParameter("senhaAtual");
        String novaSenha = request.getParameter("senha");
        String confirmarSenha = request.getParameter("confirmarSenha");

        // Validações e lógica de senha (a sua lógica original, mantida por ser boa)
        if (novaSenha != null && !novaSenha.isEmpty()) {
            if (senhaAtual == null || senhaAtual.isEmpty()) {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Digite a senha atual para confirmar a troca.");
                response.getWriter().print(resultado.toString());
                return;
            }
            UsuarioDAO usuarioDAO = new UsuarioDAO();
            Usuario autenticado = usuarioDAO.autenticar(usuarioLogado.getEmail(), senhaAtual);

            if (autenticado == null) {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Senha atual incorreta.");
                response.getWriter().print(resultado.toString());
                return;
            }
            if (!novaSenha.equals(confirmarSenha)) {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "A nova senha e a confirmação não coincidem.");
                response.getWriter().print(resultado.toString());
                return;
            }
            usuarioLogado.setSenha(novaSenha);
        }

        if (novoNome == null || novoNome.trim().isEmpty()) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "O nome não pode estar vazio.");
            response.getWriter().print(resultado.toString());
            return;
        }
        usuarioLogado.setNome(novoNome);


        // --- LÓGICA DE UPLOAD DA IMAGEM ---
        Part filePart = request.getPart("foto"); // Pega o arquivo pela parte "foto"
        String fileName = getFileName(filePart);

        // Verifica se um arquivo foi realmente enviado
        if (fileName != null && !fileName.isEmpty()) {
            try {
                // Define o caminho RELATIVO onde a imagem será salva
                String uploadPath = "uploads" + File.separator + "avatars";

                // Pega o caminho REAL no servidor onde a aplicação está rodando
                String applicationPath = request.getServletContext().getRealPath("");
                String absoluteUploadPath = applicationPath + File.separator + uploadPath;

                // Cria o diretório se ele não existir
                File uploadDir = new File(absoluteUploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Gera um nome de arquivo único para evitar conflitos
                String extension = fileName.substring(fileName.lastIndexOf("."));
                String uniqueFileName = usuarioLogado.getId() + "_" + System.currentTimeMillis() + extension;

                // Salva o arquivo no servidor
                try (InputStream fileContent = filePart.getInputStream()) {
                    Files.copy(fileContent, Paths.get(absoluteUploadPath + File.separator + uniqueFileName), StandardCopyOption.REPLACE_EXISTING);
                }

                // Atualiza o objeto do usuário com o CAMINHO RELATIVO da nova foto
                usuarioLogado.setFoto(uploadPath + File.separator + uniqueFileName);

            } catch (Exception e) {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Ocorreu um erro ao salvar a imagem.");
                response.getWriter().print(resultado.toString());
                return;
            }
        }
        // Se nenhum arquivo novo foi enviado, a foto antiga será mantida no objeto usuarioLogado.

        // --- ATUALIZAÇÃO NO BANCO DE DADOS ---
        try {
            UsuarioDAO usuarioDAO = new UsuarioDAO();
            boolean atualizado = usuarioDAO.atualizar(usuarioLogado);

            if (atualizado) {
                AuthHelper.loginSessao(request, usuarioLogado); // Atualiza a sessão
                resultado.addProperty("status", "ok");
                resultado.addProperty("mensagem", "Perfil atualizado com sucesso!");
                resultado.addProperty("nome", usuarioLogado.getNome());
                // Retorna o novo caminho da foto para o front-end
                resultado.addProperty("foto", usuarioLogado.getFoto());
            } else {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Não foi possível atualizar o perfil no banco de dados.");
            }

        } catch (Exception e) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Erro de banco de dados: " + e.getMessage());
        }

        response.getWriter().print(resultado.toString());
    }

    // Método auxiliar para extrair o nome do arquivo da requisição
    private String getFileName(Part part) {
        for (String content : part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }
}